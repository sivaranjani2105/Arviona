package com.arviona.controller;

import com.arviona.exception.BadRequestException;
import com.arviona.model.*;
import com.arviona.repository.*;
import com.arviona.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/quests")
public class QuestController {

    @Autowired
    private QuestRepository questRepository;

    @Autowired
    private QuestSubmissionRepository submissionRepository;

    @Autowired
    private StudentGamificationRepository gamificationRepository;

    @Autowired
    private StudentPetRepository petRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping("/active")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getActiveQuests(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        String studentId = userDetails.getId();
        
        // Find enrolled classes
        List<ClassEntity> classes = classRepository.findByStudentIdAndDeletedFalse(studentId);
        
        List<Map<String, Object>> response = new ArrayList<>();
        for (ClassEntity classEntity : classes) {
            List<Quest> quests = questRepository.findAllByClassEntityIdAndDeletedFalse(classEntity.getId());
            for (Quest q : quests) {
                // Check if submitted already
                Optional<QuestSubmission> sub = submissionRepository.findByQuestIdAndStudentIdAndDeletedFalse(q.getId(), studentId);
                
                // Prerequisite locking logic
                boolean locked = false;
                if (q.getParentQuest() != null) {
                    Optional<QuestSubmission> parentSub = submissionRepository.findByQuestIdAndStudentIdAndDeletedFalse(q.getParentQuest().getId(), studentId);
                    if (parentSub.isEmpty()) {
                        locked = true;
                    }
                }

                Map<String, Object> qm = new HashMap<>();
                qm.put("id", q.getId());
                qm.put("classId", classEntity.getId());
                qm.put("className", classEntity.getName());
                qm.put("title", q.getTitle());
                qm.put("description", q.getDescription());
                qm.put("rewardXp", q.getRewardXp());
                qm.put("questDataJson", q.getQuestDataJson());
                qm.put("submitted", sub.isPresent());
                qm.put("grade", sub.isPresent() ? sub.get().getGradeAssigned() : null);
                qm.put("feedback", sub.isPresent() ? sub.get().getFeedback() : null);
                qm.put("marksObtained", sub.isPresent() ? sub.get().getMarksObtained() : null);
                qm.put("parentQuestId", q.getParentQuest() != null ? q.getParentQuest().getId() : null);
                qm.put("chainName", q.getChainName());
                qm.put("locked", locked);
                
                response.add(qm);
            }
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitQuest(
            @PathVariable("id") String questId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {
        
        String studentId = userDetails.getId();
        String submissionUrl = (String) payload.get("submissionUrl");
        List<String> completedSteps = (List<String>) payload.get("completedSteps");

        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new BadRequestException("Quest not found"));

        User student = userRepository.findById(studentId).orElseThrow();

        // Check if locked
        if (quest.getParentQuest() != null) {
            Optional<QuestSubmission> parentSub = submissionRepository.findByQuestIdAndStudentIdAndDeletedFalse(quest.getParentQuest().getId(), studentId);
            if (parentSub.isEmpty()) {
                throw new BadRequestException("This quest is locked because its prerequisite has not been completed yet!");
            }
        }

        // Check duplicate submission
        Optional<QuestSubmission> existing = submissionRepository.findByQuestIdAndStudentIdAndDeletedFalse(questId, studentId);
        if (existing.isPresent()) {
            throw new BadRequestException("Quest has already been submitted!");
        }

        // Create submission
        QuestSubmission submission = QuestSubmission.builder()
                .id(UUID.randomUUID().toString())
                .quest(quest)
                .student(student)
                .submissionUrl(submissionUrl)
                .completedStepsJson(completedSteps != null ? completedSteps.toString() : "[]")
                .completedAt(LocalDateTime.now())
                .graded(false)
                .createdBy(student.getName())
                .build();

        submissionRepository.save(submission);

        // Update Gamification stats (XP, Streak, House points, Pet XP)
        StudentGamification profile = gamificationRepository.findByUserIdAndDeletedFalse(studentId)
                .orElseGet(() -> {
                    House defaultHouse = houseRepository.findAll().stream().findFirst().orElse(null);
                    return StudentGamification.builder()
                            .userId(studentId)
                            .user(student)
                            .level(1)
                            .xpTotal(0)
                            .xpNextLevel(1000)
                            .currentStreak(0)
                            .house(defaultHouse)
                            .streakLastActivity(LocalDateTime.now())
                            .createdBy("system")
                            .build();
                });

        int xpGained = quest.getRewardXp();
        int newXp = profile.getXpTotal() + xpGained;
        boolean levelUp = false;
        int currentLevel = profile.getLevel();

        if (newXp >= profile.getXpNextLevel()) {
            levelUp = true;
            currentLevel++;
            newXp = newXp - profile.getXpNextLevel();
            profile.setXpNextLevel(currentLevel * 1000);
        }

        profile.setXpTotal(newXp);
        profile.setLevel(currentLevel);
        
        // Streak update: simply increment streak for submission consistency
        profile.setCurrentStreak(profile.getCurrentStreak() + 1);
        profile.setStreakLastActivity(LocalDateTime.now());
        profile.setUpdatedBy(student.getName());
        gamificationRepository.save(profile);

        // Update House points
        House house = profile.getHouse();
        if (house != null) {
            house.setTotalPoints(house.getTotalPoints() + (xpGained / 10)); // 10% of XP is added as house points
            house.setUpdatedBy(student.getName());
            houseRepository.save(house);
        }

        // Update Pet XP
        StudentPet pet = petRepository.findByStudentIdAndDeletedFalse(studentId)
                .orElseGet(() -> StudentPet.builder()
                        .id(UUID.randomUUID().toString())
                        .student(student)
                        .petType("DRAGON")
                        .evolutionStage("BABY")
                        .petXp(0)
                        .nickname("Baby Dragon")
                        .createdBy("system")
                        .build());

        int petXpGained = xpGained / 2; // 50% of XP goes to Pet
        int newPetXp = pet.getPetXp() + petXpGained;
        pet.setPetXp(newPetXp);
        
        // Handle Pet Evolution
        String originalStage = pet.getEvolutionStage();
        if (newPetXp >= 1000 && originalStage.equals("BABY")) {
            pet.setEvolutionStage("JUNIOR");
        } else if (newPetXp >= 3000 && originalStage.equals("JUNIOR")) {
            pet.setEvolutionStage("ADVANCED");
        } else if (newPetXp >= 6000 && originalStage.equals("ADVANCED")) {
            pet.setEvolutionStage("ELITE");
        } else if (newPetXp >= 10000 && originalStage.equals("ELITE")) {
            pet.setEvolutionStage("LEGENDARY");
        }
        pet.setUpdatedBy(student.getName());
        petRepository.save(pet);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Quest completed successfully!");
        response.put("xpGained", xpGained);
        response.put("levelUp", levelUp);
        response.put("newLevel", currentLevel);
        response.put("xpTotal", newXp);
        response.put("xpNextLevel", profile.getXpNextLevel());
        response.put("newStreak", profile.getCurrentStreak());
        response.put("petNickname", pet.getNickname());
        response.put("petStage", pet.getEvolutionStage());
        response.put("petXpGained", petXpGained);
        response.put("petEvolved", !pet.getEvolutionStage().equals(originalStage));

        return ResponseEntity.ok(response);
    }

    /**
     * Returns the adaptive question pool used by the student quiz/boss-battle engine.
     * Questions are grouped by subject → difficulty → list.
     * This is a static seed pool; in production you'd pull from a questions table.
     */
    @GetMapping("/pool")
    public ResponseEntity<?> getQuestionPool() {
        List<Question> questions = questionRepository.findAllByDeletedFalse();
        
        Map<String, Map<String, List<Map<String, Object>>>> pool = new LinkedHashMap<>();
        
        for (Question q : questions) {
            String subject = q.getSubject();
            String difficulty = q.getDifficulty().toUpperCase(); // Ensure uppercase matching client (EASY, MEDIUM, HARD)
            
            pool.putIfAbsent(subject, new LinkedHashMap<>());
            pool.get(subject).putIfAbsent(difficulty, new ArrayList<>());
            
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("id", q.getId());
            qMap.put("text", q.getText());
            qMap.put("options", Arrays.asList(q.getOptions().split(";")));
            qMap.put("answer", q.getCorrectAnswer());
            qMap.put("difficulty", q.getDifficulty());
            
            pool.get(subject).get(difficulty).add(qMap);
        }
        
        // Fallback seed if database is empty for robustness
        if (pool.isEmpty()) {
            pool.put("Mathematics", Map.of(
                "EASY", List.of(
                    Map.of("id","m1","text","What is 12 × 8?","options",List.of("96","94","98","88"),"answer","96"),
                    Map.of("id","m2","text","Solve: x + 7 = 15","options",List.of("7","8","6","9"),"answer","8")
                ),
                "MEDIUM", List.of(
                    Map.of("id","m3","text","Find the derivative of x³","options",List.of("3x²","x²","3x","2x³"),"answer","3x²")
                ),
                "HARD", List.of(
                    Map.of("id","m5","text","Solve: d/dx[sin(x²)]","options",List.of("2x·cos(x²)","cos(x²)","2sin(x)","cos(2x)"),"answer","2x·cos(x²)")
                )
            ));
        }

        return ResponseEntity.ok(pool);
    }
}
