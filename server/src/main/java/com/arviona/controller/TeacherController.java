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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/teachers")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {

    @Autowired private DashboardService dashboardService;
    @Autowired private UserRepository userRepository;
    @Autowired private FileMetadataRepository fileMetadataRepository;
    @Autowired private SchoolEventRepository schoolEventRepository;
    @Autowired private ClassRepository classRepository;
    @Autowired private NotificationRepository notificationRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(dashboardService.getTeacherDashboard(userDetails.getId()));
    }

    // ── Written Notes ──────────────────────────────────────────────────────────
    @GetMapping("/notes")
    public ResponseEntity<?> getNotes(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<FileMetadata> notes = fileMetadataRepository.findByUploadedByAndDeletedFalse(userDetails.getId());
        List<Map<String, Object>> result = notes.stream().map(n -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", n.getId());
            m.put("title", n.getOriginalName());
            m.put("content", n.getDescription() != null ? n.getDescription() : "");
            m.put("studentId", n.getStudentId());
            m.put("fileName", n.getOriginalName());
            m.put("createdAt", n.getCreatedAt() != null ? n.getCreatedAt().toString() : "");
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/notes")
    public ResponseEntity<?> addNote(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {
        String title   = (String) payload.getOrDefault("title", "Untitled Note");
        String content = (String) payload.getOrDefault("content", "");
        String studentId = (String) payload.get("studentId");

        FileMetadata note = FileMetadata.builder()
                .id(UUID.randomUUID().toString())
                .originalName(title)
                .description(content)
                .studentId(studentId)
                .uploadedBy(userDetails.getId())
                .mimeType("text/plain")
                .fileSize(0L)
                .createdBy(userDetails.getName())
                .build();
        fileMetadataRepository.save(note);

        // Notify the student if studentId is provided
        if (studentId != null && !studentId.isBlank()) {
            userRepository.findById(studentId).ifPresent(studentUser -> {
                Notification notif = Notification.builder()
                        .id(UUID.randomUUID().toString())
                        .user(studentUser)
                        .title("New note from your teacher")
                        .message("Your teacher shared a note: " + title)
                        .type("NOTE")
                        .readStatus(false)
                        .createdBy(userDetails.getName())
                        .build();
                notificationRepository.save(notif);
            });
        }

        return ResponseEntity.ok(Map.of("message", "Note added", "id", note.getId()));
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        FileMetadata note = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Note not found"));
        note.setDeleted(true);
        note.setUpdatedBy(userDetails.getName());
        fileMetadataRepository.save(note);
        return ResponseEntity.ok(Map.of("message", "Note deleted"));
    }

    // ── Schedule Events ────────────────────────────────────────────────────────
    @GetMapping("/events")
    public ResponseEntity<?> getEvents(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        // Return events created by this teacher's school
        List<SchoolEvent> events = schoolEventRepository.findAllByDeletedFalse();
        List<Map<String, Object>> result = events.stream().map(e -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", e.getId());
            m.put("title", e.getName());
            m.put("desc", e.getDescription() != null ? e.getDescription() : "");
            m.put("type", "CLASS");
            m.put("date", e.getStartDate().toString());
            m.put("time", "09:00");
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/events")
    public ResponseEntity<?> createEvent(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {
        String name = (String) payload.getOrDefault("title", "Class Session");
        String description = (String) payload.getOrDefault("desc", "");
        String dateStr = (String) payload.getOrDefault("date", LocalDate.now().toString());

        SchoolEvent event = SchoolEvent.builder()
                .id(UUID.randomUUID().toString())
                .name(name)
                .description(description)
                .startDate(LocalDate.parse(dateStr))
                .durationDays(1)
                .rewardXp(0)
                .rewardCoins(0)
                .active(true)
                .createdBy(userDetails.getName())
                .build();
        schoolEventRepository.save(event);
        return ResponseEntity.ok(Map.of("message", "Event created", "id", event.getId()));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        SchoolEvent evt = schoolEventRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Event not found"));
        evt.setDeleted(true);
        evt.setUpdatedBy(userDetails.getName());
        schoolEventRepository.save(evt);
        return ResponseEntity.ok(Map.of("message", "Event deleted"));
    }

    // ── Send Notification to student ───────────────────────────────────────────
    @PostMapping("/notify")
    public ResponseEntity<?> sendNotification(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {
        String studentId = (String) payload.get("studentId");
        String message   = (String) payload.getOrDefault("message", "");
        String title     = (String) payload.getOrDefault("title", "Teacher notification");
        String type      = (String) payload.getOrDefault("type", "INFO");

        if (studentId == null || studentId.isBlank()) {
            throw new BadRequestException("studentId is required");
        }

        User studentUser = userRepository.findById(studentId)
                .orElseThrow(() -> new BadRequestException("Student not found: " + studentId));

        Notification notif = Notification.builder()
                .id(UUID.randomUUID().toString())
                .user(studentUser)
                .title(title)
                .message(message)
                .type(type)
                .readStatus(false)
                .createdBy(userDetails.getName())
                .build();
        notificationRepository.save(notif);
        return ResponseEntity.ok(Map.of("message", "Notification sent"));
    }
}
