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
@RequestMapping("/api/v1/boss-battles")
public class BossBattleController {

    @Autowired
    private BossBattleRepository bossBattleRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private StudentGamificationRepository gamificationRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private StudentPetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/active")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getActiveBossBattles(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        String studentId = userDetails.getId();
        List<ClassEntity> classes = classRepository.findByStudentIdAndDeletedFalse(studentId);
        
        List<Map<String, Object>> response = new ArrayList<>();
        for (ClassEntity classEntity : classes) {
            List<BossBattle> battles = bossBattleRepository.findAllByClassEntityIdAndDeletedFalse(classEntity.getId());
            for (BossBattle b : battles) {
                Map<String, Object> bm = new HashMap<>();
                bm.put("id", b.getId());
                bm.put("classId", classEntity.getId());
                bm.put("className", classEntity.getName());
                bm.put("title", b.getTitle());
                bm.put("timeLimitSeconds", b.getTimeLimitSeconds());
                bm.put("rewardXp", b.getRewardXp());
                bm.put("difficulty", b.getDifficulty());
                bm.put("questionsPoolJson", b.getQuestionsPoolJson());
                response.add(bm);
            }
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> startBattle(@PathVariable("id") String battleId) {
        BossBattle battle = bossBattleRepository.findById(battleId)
                .orElseThrow(() -> new BadRequestException("Boss Battle not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", battle.getId());
        response.put("title", battle.getTitle());
        response.put("timeLimitSeconds", battle.getTimeLimitSeconds());
        response.put("difficulty", battle.getDifficulty());
        response.put("questionsPoolJson", battle.getQuestionsPoolJson());
        response.put("startedAt", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitBattle(
            @PathVariable("id") String battleId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {
        
        String studentId = userDetails.getId();
        BossBattle battle = bossBattleRepository.findById(battleId)
                .orElseThrow(() -> new BadRequestException("Boss Battle not found"));

        User student = userRepository.findById(studentId).orElseThrow();

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

        int xpGained = battle.getRewardXp();
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
        profile.setUpdatedBy(student.getName());
        gamificationRepository.save(profile);

        // Update House score (30% of Boss Battle XP goes to House score)
        House house = profile.getHouse();
        if (house != null) {
            house.setTotalPoints(house.getTotalPoints() + (xpGained * 30 / 100));
            house.setUpdatedBy(student.getName());
            houseRepository.save(house);
        }

        // Update Pet XP (Double XP for pets in Boss Battles)
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

        int petXpGained = xpGained; // 100% of XP goes to Pet in Boss Battles
        int newPetXp = pet.getPetXp() + petXpGained;
        pet.setPetXp(newPetXp);
        
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
        response.put("message", "Boss defeated! Battle completed successfully.");
        response.put("xpGained", xpGained);
        response.put("levelUp", levelUp);
        response.put("newLevel", currentLevel);
        response.put("xpTotal", newXp);
        response.put("petNickname", pet.getNickname());
        response.put("petStage", pet.getEvolutionStage());
        response.put("petXpGained", petXpGained);
        response.put("petEvolved", !pet.getEvolutionStage().equals(originalStage));

        return ResponseEntity.ok(response);
    }
}
