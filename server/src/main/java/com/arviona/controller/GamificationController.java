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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/gamification")
public class GamificationController {

    @Autowired
    private StudentGamificationRepository gamificationRepository;

    @Autowired
    private StudentDailyJourneyRepository dailyJourneyRepository;

    @Autowired
    private SchoolEventRepository schoolEventRepository;

    @Autowired
    private StudentPetRepository petRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private StudentKnowledgeMapRepository knowledgeMapRepository;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        String studentId = userDetails.getId();

        StudentGamification profile = gamificationRepository.findByUserIdAndDeletedFalse(studentId)
                .orElseGet(() -> {
                    User student = userRepository.findById(studentId).orElseThrow();
                    House defaultHouse = houseRepository.findAll().stream().findFirst().orElse(null);
                    
                    StudentGamification newProfile = StudentGamification.builder()
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
                    
                    return gamificationRepository.save(newProfile);
                });

        StudentPet pet = petRepository.findByStudentIdAndDeletedFalse(studentId)
                .orElseGet(() -> {
                    User student = userRepository.findById(studentId).orElseThrow();
                    StudentPet newPet = StudentPet.builder()
                            .id(UUID.randomUUID().toString())
                            .student(student)
                            .petType("DRAGON")
                            .evolutionStage("BABY")
                            .petXp(0)
                            .nickname("Baby Dragon")
                            .createdBy("system")
                            .build();
                    
                    return petRepository.save(newPet);
                });

        Map<String, Object> response = new HashMap<>();
        response.put("level", profile.getLevel());
        response.put("xpTotal", profile.getXpTotal());
        response.put("xpNextLevel", profile.getXpNextLevel());
        response.put("currentStreak", profile.getCurrentStreak());
        response.put("house", profile.getHouse() != null ? profile.getHouse().getName() : "None");
        
        Map<String, Object> petMap = new HashMap<>();
        petMap.put("petType", pet.getPetType());
        petMap.put("evolutionStage", pet.getEvolutionStage());
        petMap.put("petXp", pet.getPetXp());
        petMap.put("nickname", pet.getNickname());
        response.put("pet", petMap);

        // Fetch Badges
        List<Map<String, Object>> badgesList = badgeRepository.findAllByDeletedFalse().stream()
                .map(b -> {
                    Map<String, Object> bm = new HashMap<>();
                    bm.put("name", b.getName());
                    bm.put("description", b.getDescription());
                    bm.put("iconName", b.getIconName());
                    bm.put("rewardXp", b.getRewardXp());
                    return bm;
                }).collect(Collectors.toList());
        response.put("badges", badgesList);

        // Fetch Knowledge Map
        List<Map<String, Object>> mapList = knowledgeMapRepository.findAllByStudentIdAndDeletedFalse(studentId).stream()
                .map(k -> {
                    Map<String, Object> km = new HashMap<>();
                    km.put("subject", k.getSubject());
                    km.put("topic", k.getTopic());
                    km.put("subtopic", k.getSubtopic());
                    km.put("status", k.getStatus());
                    km.put("scorePercentage", k.getScorePercentage());
                    return km;
                }).collect(Collectors.toList());
        response.put("knowledgeMap", mapList);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/houses")
    public ResponseEntity<?> getHouseScoreboard() {
        List<House> houses = houseRepository.findAllByDeletedFalseOrderByTotalPointsDesc();
        List<Map<String, Object>> scoreboard = houses.stream().map(h -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", h.getId());
            m.put("name", h.getName());
            m.put("colorHex", h.getColorHex());
            m.put("totalPoints", h.getTotalPoints());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(scoreboard);
    }

    @PostMapping("/pet/rename")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> renamePet(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, String> payload) {
        
        String newName = payload.get("nickname");
        if (newName == null || newName.trim().isEmpty()) {
            throw new BadRequestException("Nickname cannot be empty");
        }

        StudentPet pet = petRepository.findByStudentIdAndDeletedFalse(userDetails.getId())
                .orElseThrow(() -> new BadRequestException("Pet not found for user"));

        pet.setNickname(newName.trim());
        pet.setUpdatedBy(userDetails.getName());
        petRepository.save(pet);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Pet renamed successfully!");
        response.put("nickname", pet.getNickname());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/daily-journey")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getDailyJourney(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        String studentId = userDetails.getId();
        LocalDate today = LocalDate.now();

        StudentDailyJourney journey = dailyJourneyRepository.findByStudentIdAndJourneyDateAndDeletedFalse(studentId, today)
                .orElseGet(() -> {
                    User student = userRepository.findById(studentId).orElseThrow();
                    StudentDailyJourney newJourney = StudentDailyJourney.builder()
                            .id(UUID.randomUUID().toString())
                            .student(student)
                            .journeyDate(today)
                            .mission1Completed(false)
                            .mission2Completed(false)
                            .mission3Completed(false)
                            .dailyBonusClaimed(false)
                            .createdBy("system")
                            .build();
                    return dailyJourneyRepository.save(newJourney);
                });

        Map<String, Object> response = new HashMap<>();
        response.put("id", journey.getId());
        response.put("journeyDate", journey.getJourneyDate().toString());
        response.put("mission1Completed", journey.isMission1Completed());
        response.put("mission2Completed", journey.isMission2Completed());
        response.put("mission3Completed", journey.isMission3Completed());
        response.put("dailyBonusClaimed", journey.isDailyBonusClaimed());

        // Dynamic, personalized daily missions based on Student's Knowledge Map state
        List<StudentKnowledgeMap> kms = knowledgeMapRepository.findAllByStudentIdAndDeletedFalse(studentId);
        
        String weakTopic = "Calculus";
        String weakSubject = "Mathematics";
        boolean hasWeak = false;

        // Try to find a Critical or Weak topic first
        Optional<StudentKnowledgeMap> weakKmo = kms.stream()
                .filter(k -> "Critical".equalsIgnoreCase(k.getStatus()) || "Weak".equalsIgnoreCase(k.getStatus()))
                .findFirst();

        if (weakKmo.isPresent()) {
            weakTopic = weakKmo.get().getTopic();
            weakSubject = weakKmo.get().getSubject();
            hasWeak = true;
        } else {
            // Fall back to any topic currently marked as Learning
            Optional<StudentKnowledgeMap> learningKmo = kms.stream()
                    .filter(k -> "Learning".equalsIgnoreCase(k.getStatus()))
                    .findFirst();
            if (learningKmo.isPresent()) {
                weakTopic = learningKmo.get().getTopic();
                weakSubject = learningKmo.get().getSubject();
                hasWeak = true;
            }
        }

        if (hasWeak) {
            response.put("mission1Text", "Solve 5 practice questions targeting: " + weakTopic + " (" + weakSubject + ")");
            response.put("mission2Text", "Complete a 3-minute Arivo companion session reviewing: " + weakTopic);
            response.put("mission3Text", "Complete any active homework quest or review " + weakSubject + " course modules");
        } else {
            // Default missions if student has perfect knowledge map or empty
            response.put("mission1Text", "Solve 5 calculus derivatives practice questions");
            response.put("mission2Text", "Complete a 3-minute AI Study Companion fraction challenge");
            response.put("mission3Text", "Purchase and equip a cosmetic skin/theme from the Store");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/daily-journey/complete-mission/{number}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> completeMission(
            @PathVariable("number") int number,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        String studentId = userDetails.getId();
        LocalDate today = LocalDate.now();

        StudentDailyJourney journey = dailyJourneyRepository.findByStudentIdAndJourneyDateAndDeletedFalse(studentId, today)
                .orElseThrow(() -> new BadRequestException("Daily journey not initialized for today"));

        if (number == 1) {
            journey.setMission1Completed(true);
        } else if (number == 2) {
            journey.setMission2Completed(true);
        } else if (number == 3) {
            journey.setMission3Completed(true);
        } else {
            throw new BadRequestException("Invalid mission number: " + number);
        }

        journey.setUpdatedAt(LocalDateTime.now());
        journey.setUpdatedBy(userDetails.getName());
        dailyJourneyRepository.save(journey);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Mission " + number + " completed successfully!");
        response.put("mission1Completed", journey.isMission1Completed());
        response.put("mission2Completed", journey.isMission2Completed());
        response.put("mission3Completed", journey.isMission3Completed());
        response.put("dailyBonusClaimed", journey.isDailyBonusClaimed());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/daily-journey/claim")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> claimDailyBonus(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        String studentId = userDetails.getId();
        LocalDate today = LocalDate.now();

        StudentDailyJourney journey = dailyJourneyRepository.findByStudentIdAndJourneyDateAndDeletedFalse(studentId, today)
                .orElseThrow(() -> new BadRequestException("Daily journey not found for today"));

        if (!journey.isMission1Completed() || !journey.isMission2Completed() || !journey.isMission3Completed()) {
            throw new BadRequestException("All daily missions must be completed before claiming bonus!");
        }

        if (journey.isDailyBonusClaimed()) {
            throw new BadRequestException("Daily completion bonus has already been claimed today!");
        }

        journey.setDailyBonusClaimed(true);
        journey.setUpdatedAt(LocalDateTime.now());
        journey.setUpdatedBy(userDetails.getName());
        dailyJourneyRepository.save(journey);

        // Award rewards
        StudentGamification profile = gamificationRepository.findByUserIdAndDeletedFalse(studentId)
                .orElseThrow(() -> new BadRequestException("Gamification profile not found"));

        int xpGained = 200;
        int coinsGained = 50;

        int newXp = profile.getXpTotal() + xpGained;
        int currentLevel = profile.getLevel();
        boolean levelUp = false;

        if (newXp >= profile.getXpNextLevel()) {
            levelUp = true;
            currentLevel++;
            newXp = newXp - profile.getXpNextLevel();
            profile.setXpNextLevel(currentLevel * 1000);
        }

        profile.setXpTotal(newXp);
        profile.setLevel(currentLevel);
        profile.setCoinsBalance(profile.getCoinsBalance() + coinsGained);
        profile.setUpdatedAt(LocalDateTime.now());
        profile.setUpdatedBy("system");
        gamificationRepository.save(profile);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Daily completion bonus claimed successfully!");
        response.put("xpGained", xpGained);
        response.put("coinsGained", coinsGained);
        response.put("level", profile.getLevel());
        response.put("xpTotal", profile.getXpTotal());
        response.put("xpNextLevel", profile.getXpNextLevel());
        response.put("coinsBalance", profile.getCoinsBalance());
        response.put("levelUp", levelUp);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/events")
    public ResponseEntity<?> getEvents() {
        List<SchoolEvent> events = schoolEventRepository.findAllByActiveTrueAndDeletedFalse();
        List<Map<String, Object>> response = events.stream().map(e -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", e.getId());
            m.put("name", e.getName());
            m.put("description", e.getDescription());
            m.put("durationDays", e.getDurationDays());
            m.put("rewardXp", e.getRewardXp());
            m.put("rewardCoins", e.getRewardCoins());
            m.put("badge", e.getBadge() != null ? e.getBadge().getName() : null);
            m.put("active", e.isActive());
            m.put("startDate", e.getStartDate().toString());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
