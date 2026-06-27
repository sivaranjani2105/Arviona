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
@RequestMapping("/api/v1/weekly-reports")
public class WeeklyReportController {

    @Autowired private WeeklyReportRepository weeklyReportRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private StudentKnowledgeMapRepository knowledgeMapRepository;
    @Autowired private StudentGamificationRepository gamificationRepository;
    @Autowired private NotificationRepository notificationRepository;

    // ── Teacher: generate report ────────────────────────────────────────────
    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> generateReport(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {

        String studentId    = (String) payload.get("studentId");
        String teacherNotes = (String) payload.getOrDefault("teacherNotes", "");
        if (studentId == null || studentId.isBlank()) throw new BadRequestException("studentId required");

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new BadRequestException("Student not found"));

        List<StudentKnowledgeMap> kms = knowledgeMapRepository.findAllByStudentIdAndDeletedFalse(studentId);
        List<String> strengths  = kms.stream()
                .filter(k -> "Mastered".equalsIgnoreCase(k.getStatus()))
                .map(StudentKnowledgeMap::getTopic).collect(Collectors.toList());
        List<String> weakTopics = kms.stream()
                .filter(k -> "Weak".equalsIgnoreCase(k.getStatus()) || "Critical".equalsIgnoreCase(k.getStatus()))
                .map(StudentKnowledgeMap::getTopic).collect(Collectors.toList());

        int xpThisWeek = gamificationRepository.findByUserIdAndDeletedFalse(studentId)
                .map(StudentGamification::getXpTotal).orElse(0);

        WeeklyReport report = WeeklyReport.builder()
                .id(UUID.randomUUID().toString())
                .studentId(studentId)
                .studentName(student.getName())
                .teacherId(userDetails.getId())
                .teacherName(userDetails.getName())
                .teacherNotes(teacherNotes)
                .strengths(String.join(", ", strengths.isEmpty() ? List.of("General Studies") : strengths))
                .weakTopics(String.join(", ", weakTopics.isEmpty() ? List.of("None identified") : weakTopics))
                .xpThisWeek(xpThisWeek)
                .createdBy(userDetails.getName())
                .build();
        weeklyReportRepository.save(report);

        return ResponseEntity.ok(Map.of(
            "message", "Report generated",
            "id",         report.getId(),
            "studentName", student.getName(),
            "strengths",  strengths,
            "weakTopics", weakTopics,
            "xpThisWeek", xpThisWeek,
            "sentToParent", false
        ));
    }

    // ── Teacher: send report to parent ──────────────────────────────────────
    @PostMapping("/{id}/send")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> sendToParent(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        WeeklyReport report = weeklyReportRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Report not found"));
        report.setSentToParent(true);
        report.setSentAt(LocalDateTime.now());
        report.setUpdatedBy(userDetails.getName());
        weeklyReportRepository.save(report);

        // Notify all parents linked to this student
        userRepository.findById(report.getStudentId()).ifPresent(student -> {
            for (User parent : student.getParents()) {
                Notification notif = Notification.builder()
                        .id(UUID.randomUUID().toString())
                        .user(parent)
                        .title("📊 New Weekly Progress Report")
                        .message("A new progress report has been shared for " + report.getStudentName()
                                + ". Strengths: " + report.getStrengths()
                                + ". Focus areas: " + report.getWeakTopics())
                        .type("REPORT")
                        .readStatus(false)
                        .createdBy(userDetails.getName())
                        .build();
                notificationRepository.save(notif);
            }
        });

        return ResponseEntity.ok(Map.of("message", "Report sent to parent successfully"));
    }

    // ── Teacher: list all their reports ────────────────────────────────────
    @GetMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getMyReports(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(
            weeklyReportRepository
                .findByTeacherIdAndDeletedFalseOrderByCreatedAtDesc(userDetails.getId())
                .stream().map(this::toMap).collect(Collectors.toList())
        );
    }

    // ── Parent: get reports for their children ──────────────────────────────
    @GetMapping("/for-parent")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<?> getReportsForParent(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User parent = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BadRequestException("Parent not found"));
        List<Map<String, Object>> allReports = new ArrayList<>();
        for (User child : parent.getStudents()) {
            weeklyReportRepository
                .findByStudentIdAndSentToParentTrueAndDeletedFalseOrderByCreatedAtDesc(child.getId())
                .forEach(r -> allReports.add(toMap(r)));
        }
        return ResponseEntity.ok(allReports);
    }

    private Map<String, Object> toMap(WeeklyReport r) {
        Map<String, Object> m = new HashMap<>();
        m.put("id",           r.getId());
        m.put("studentId",    r.getStudentId());
        m.put("studentName",  r.getStudentName());
        m.put("teacherName",  r.getTeacherName());
        m.put("teacherNotes", r.getTeacherNotes() != null ? r.getTeacherNotes() : "");
        m.put("strengths",    r.getStrengths() != null ? r.getStrengths() : "");
        m.put("weakTopics",   r.getWeakTopics() != null ? r.getWeakTopics() : "");
        m.put("xpThisWeek",   r.getXpThisWeek());
        m.put("sentToParent", r.isSentToParent());
        m.put("createdAt",    r.getCreatedAt() != null ? r.getCreatedAt().toString() : "");
        return m;
    }
}
