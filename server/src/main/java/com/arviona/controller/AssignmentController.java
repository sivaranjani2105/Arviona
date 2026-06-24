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
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/v1/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> createAssignment(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {
        
        String classId = (String) payload.get("classId");
        String title = (String) payload.get("title");
        String description = (String) payload.get("description");
        String dueDateStr = (String) payload.get("dueDate");
        Integer totalMarks = (Integer) payload.get("totalMarks");

        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new BadRequestException("Class not found"));

        User teacher = userRepository.findById(userDetails.getId()).orElseThrow();

        LocalDateTime dueDate = LocalDateTime.parse(dueDateStr, DateTimeFormatter.ISO_DATE_TIME);

        Assignment assignment = Assignment.builder()
                .id(UUID.randomUUID().toString())
                .institution(classEntity.getInstitution())
                .classEntity(classEntity)
                .title(title)
                .description(description)
                .dueDate(dueDate)
                .totalMarks(totalMarks != null ? totalMarks : 100)
                .createdBy(teacher.getName())
                .build();

        assignmentRepository.save(assignment);
        return ResponseEntity.ok(assignment);
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitAssignment(
            @PathVariable("id") String assignmentId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, String> payload) {

        String submissionUrl = payload.get("submissionUrl");

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new BadRequestException("Assignment not found"));

        User student = userRepository.findById(userDetails.getId()).orElseThrow();

        // Check if submission already exists
        Optional<Submission> existing = submissionRepository.findByAssignmentIdAndStudentIdAndDeletedFalse(assignmentId, student.getId());
        if (existing.isPresent()) {
            throw new BadRequestException("You have already submitted this assignment!");
        }

        Submission submission = Submission.builder()
                .id(UUID.randomUUID().toString())
                .institution(assignment.getInstitution())
                .assignment(assignment)
                .student(student)
                .submittedAt(LocalDateTime.now())
                .grade(null) // Pending grading
                .marksObtained(null)
                .feedback(null)
                .createdBy(student.getName())
                .build();

        submissionRepository.save(submission);
        return ResponseEntity.ok(submission);
    }
}
