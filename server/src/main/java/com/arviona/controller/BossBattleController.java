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

    @Autowired private BossBattleRepository bossBattleRepository;
    @Autowired private StudentGamificationRepository gamificationRepository;
    @Autowired private StudentPetRepository petRepository;
    @Autowired private HouseRepository houseRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> listBattles() {
        List<BossBattle> battles = bossBattleRepository.findAllByActiveTrueAndDeletedFalse();
        List<Map<String, Object>> result = battles.stream().map(b -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", b.getId());
            m.put("title", b.getTitle());
            m.put("description", b.getDescription());
            m.put("subject", b.getSubject());
            m.put("difficulty", b.getDifficulty());
            m.put("timeLimitMins", b.getTimeLimitMins());
            m.put("totalQuestions", b.getTotalQuestions());
            m.put("xpReward", b.getXpReward());
            m.put("coinsReward", b.getCoinsReward());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitBattle(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {

        String studentId = userDetails.getId();
        BossBattle battle = bossBattleRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Boss Battle not found"));

        int correctAnswers = payload.containsKey("correctAnswers")
                ? ((Number) payload.get("correctAnswers")).intValue() : 0;
        int totalQuestions = battle.getTotalQuestions();
        int score = totalQuestions > 0 ? (correctAnswers * 100 / totalQuestions) : 0;
        boolean won = score >= 60;

        // Award XP and coins based on result
        int xpAwarded    = won ? battle.getXpReward() : battle.getXpReward() / 4;
        int coinsAwarded = won ? battle.getCoinsReward() : battle.getCoinsReward() / 4;

        User student = userRepository.findById(studentId).orElseThrow();
        StudentGamification profile = gamificationRepository.findByUserIdAndDeletedFalse(studentId)
                .orElseGet(() -> {
                    House defaultHouse = houseRepository.findAll().stream().findFirst().orElse(null);
                    return StudentGamification.builder()
                            .userId(studentId).user(student).level(1).xpTotal(0)
                            .xpNextLevel(1000).currentStreak(0).house(defaultHouse)
                            .streakLastActivity(LocalDateTime.now()).createdBy("system").build();
                });

        int newXp = profile.getXpTotal() + xpAwarded;
        boolean levelUp = false;
        int level = profile.getLevel();
        if (newXp >= profile.getXpNextLevel()) {
            levelUp = true;
            level++;
            newXp -= profile.getXpNextLevel();
            profile.setXpNextLevel(level * 1000);
        }
        profile.setXpTotal(newXp);
        profile.setLevel(level);
        profile.setCoinsBalance(profile.getCoinsBalance() + coinsAwarded);
        if (won) profile.setCurrentStreak(profile.getCurrentStreak() + 1);
        profile.setStreakLastActivity(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());
        profile.setUpdatedBy("system");
        gamificationRepository.save(profile);

        // House points
        House house = profile.getHouse();
        if (house != null && won) {
            house.setTotalPoints(house.getTotalPoints() + (xpAwarded / 10));
            house.setUpdatedBy(student.getName());
            houseRepository.save(house);
        }

        // Pet XP
        StudentPet pet = petRepository.findByStudentIdAndDeletedFalse(studentId).orElse(null);
        String petStage = pet != null ? pet.getEvolutionStage() : "BABY";
        if (pet != null) {
            int petXpGained = xpAwarded / 2;
            int newPetXp = pet.getPetXp() + petXpGained;
            pet.setPetXp(newPetXp);
            String oldStage = pet.getEvolutionStage();
            if (newPetXp >= 1000 && oldStage.equals("BABY"))         pet.setEvolutionStage("JUNIOR");
            else if (newPetXp >= 3000 && oldStage.equals("JUNIOR"))  pet.setEvolutionStage("ADVANCED");
            else if (newPetXp >= 6000 && oldStage.equals("ADVANCED")) pet.setEvolutionStage("ELITE");
            else if (newPetXp >= 10000 && oldStage.equals("ELITE"))   pet.setEvolutionStage("LEGENDARY");
            pet.setUpdatedBy(student.getName());
            petRepository.save(pet);
            petStage = pet.getEvolutionStage();
        }

        return ResponseEntity.ok(Map.of(
                "won", won,
                "score", score,
                "correctAnswers", correctAnswers,
                "totalQuestions", totalQuestions,
                "xpAwarded", xpAwarded,
                "coinsAwarded", coinsAwarded,
                "level", level,
                "xpTotal", newXp,
                "levelUp", levelUp,
                "petStage", petStage
        ));
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<?> createBattle(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {
        BossBattle battle = BossBattle.builder()
                .id(UUID.randomUUID().toString())
                .title((String) payload.getOrDefault("title", "Boss Battle"))
                .description((String) payload.getOrDefault("description", ""))
                .subject((String) payload.getOrDefault("subject", "Mathematics"))
                .difficulty((String) payload.getOrDefault("difficulty", "MEDIUM"))
                .timeLimitMins(payload.containsKey("timeLimitMins") ? ((Number) payload.get("timeLimitMins")).intValue() : 30)
                .totalQuestions(payload.containsKey("totalQuestions") ? ((Number) payload.get("totalQuestions")).intValue() : 5)
                .xpReward(payload.containsKey("xpReward") ? ((Number) payload.get("xpReward")).intValue() : 300)
                .coinsReward(payload.containsKey("coinsReward") ? ((Number) payload.get("coinsReward")).intValue() : 100)
                .active(true)
                .createdBy(userDetails.getName())
                .build();
        bossBattleRepository.save(battle);
        return ResponseEntity.ok(Map.of("message", "Boss Battle created", "id", battle.getId()));
    }
}
