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
import java.util.*;

@RestController
@RequestMapping("/api/v1/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> logAttendance(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload) {

        String classId = (String) payload.get("classId");
        String studentId = (String) payload.get("studentId");
        String dateStr = (String) payload.get("date");
        String statusStr = (String) payload.get("status");
        String remarks = (String) payload.get("remarks");

        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new BadRequestException("Class not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new BadRequestException("Student not found"));

        LocalDate date = LocalDate.parse(dateStr);
        Attendance.Status status = Attendance.Status.valueOf(statusStr.toUpperCase());

        Attendance attendance = Attendance.builder()
                .id(UUID.randomUUID().toString())
                .classEntity(classEntity)
                .student(student)
                .attendanceDate(date)
                .status(status)
                .remarks(remarks)
                .createdBy(userDetails.getName())
                .build();

        attendanceRepository.save(attendance);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<Attendance>> getClassAttendance(@PathVariable("classId") String classId) {
        List<Attendance> logs = attendanceRepository.findByClassEntityIdAndDeletedFalse(classId);
        return ResponseEntity.ok(logs);
    }
}
