package com.arviona.controller;

import com.arviona.exception.BadRequestException;
import com.arviona.model.*;
import com.arviona.repository.*;
import com.arviona.security.UserDetailsImpl;
import com.arviona.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/students")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    @Autowired private DashboardService dashboardService;
    @Autowired private UserRepository userRepository;
    @Autowired private StudentKnowledgeMapRepository knowledgeMapRepository;
    @Autowired private StudentGamificationRepository gamificationRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(dashboardService.getStudentDashboard(userDetails.getId()));
    }

    // ── Knowledge Map XP award (called after quiz completion) ──────────────────
    @PostMapping("/award-xp")
    public ResponseEntity<?> awardXp(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {
        String studentId = userDetails.getId();
        int xpAmount = payload.containsKey("xp") ? ((Number) payload.get("xp")).intValue() : 50;
        String subject  = (String) payload.getOrDefault("subject", "General");
        int score       = payload.containsKey("score") ? ((Number) payload.get("score")).intValue() : 0;

        StudentGamification profile = gamificationRepository.findByUserIdAndDeletedFalse(studentId)
                .orElseThrow(() -> new BadRequestException("Gamification profile not found"));

        int newXp = profile.getXpTotal() + xpAmount;
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
        profile.setCoinsBalance(profile.getCoinsBalance() + (xpAmount / 5));
        profile.setUpdatedAt(LocalDateTime.now());
        profile.setUpdatedBy("system");
        gamificationRepository.save(profile);

        // Upsert knowledge map entry
        String status = score >= 80 ? "Mastered" : score >= 60 ? "Learning" : score >= 40 ? "Weak" : "Critical";
        Optional<StudentKnowledgeMap> kmOpt = knowledgeMapRepository
                .findByStudentIdAndSubjectAndDeletedFalse(studentId, subject);
        StudentKnowledgeMap km = kmOpt.orElseGet(() -> {
            User u = userRepository.findById(studentId).orElseThrow();
            return StudentKnowledgeMap.builder()
                    .id(UUID.randomUUID().toString())
                    .student(u)
                    .subject(subject)
                    .topic(subject)
                    .subtopic("General")
                    .createdBy("system")
                    .build();
        });
        km.setScorePercentage(new java.math.BigDecimal(score));
        km.setStatus(status);
        km.setUpdatedAt(LocalDateTime.now());
        km.setUpdatedBy("system");
        knowledgeMapRepository.save(km);

        return ResponseEntity.ok(Map.of(
                "xpGained", xpAmount,
                "newXpTotal", newXp,
                "level", level,
                "levelUp", levelUp,
                "knowledgeStatus", status
        ));
    }
}
