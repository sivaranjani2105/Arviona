package com.arviona.service;

import com.arviona.model.*;
import com.arviona.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.Cacheable;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Cacheable(value = "studentDashboards", key = "#studentId")
    public Map<String, Object> getStudentDashboard(String studentId) {
        Map<String, Object> data = new HashMap<>();

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        List<ClassEntity> classes = classRepository.findByStudentIdAndDeletedFalse(studentId);
        List<Grade> grades = gradeRepository.findByStudentIdAndDeletedFalse(studentId);
        List<Attendance> attendances = attendanceRepository.findByStudentIdAndDeletedFalse(studentId);
        List<Submission> submissions = submissionRepository.findByStudentIdAndDeletedFalse(studentId);
        List<Notification> notifications = notificationRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(studentId);

        // Fetch all assignments for enrolled classes
        List<String> classIds = classes.stream().map(ClassEntity::getId).collect(Collectors.toList());
        List<Assignment> assignments = new ArrayList<>();
        for (String classId : classIds) {
            assignments.addAll(assignmentRepository.findByClassEntityIdAndDeletedFalse(classId));
        }

        data.put("profile", Map.of("id", student.getId(), "name", student.getName(), "email", student.getEmail()));
        data.put("classes", classes.stream().map(c -> Map.of(
                "id", c.getId(),
                "name", c.getName(),
                "scheduleDays", c.getScheduleDays() != null ? c.getScheduleDays() : "",
                "scheduleTime", c.getScheduleTime() != null ? c.getScheduleTime() : "",
                "teacher", c.getTeacher() != null ? c.getTeacher().getName() : "N/A"
        )).collect(Collectors.toList()));

        data.put("grades", grades.stream().map(g -> Map.of(
                "id", g.getId(),
                "class", g.getClassEntity().getName(),
                "assessment", g.getAssessmentName(),
                "marks", g.getMarks(),
                "total", g.getTotalMarks(),
                "grade", g.getGrade() != null ? g.getGrade() : ""
        )).collect(Collectors.toList()));

        data.put("attendance", attendances.stream().map(a -> Map.of(
                "id", a.getId(),
                "class", a.getClassEntity().getName(),
                "date", a.getAttendanceDate().toString(),
                "status", a.getStatus().toString(),
                "remarks", a.getRemarks() != null ? a.getRemarks() : ""
        )).collect(Collectors.toList()));

        data.put("assignments", assignments.stream().map(a -> {
            Optional<Submission> sub = submissions.stream()
                    .filter(s -> s.getAssignment().getId().equals(a.getId()))
                    .findFirst();

            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("class", a.getClassEntity().getName());
            map.put("title", a.getTitle());
            map.put("description", a.getDescription() != null ? a.getDescription() : "");
            map.put("dueDate", a.getDueDate().toString());
            map.put("totalMarks", a.getTotalMarks());
            map.put("submitted", sub.isPresent());
            map.put("grade", sub.map(Submission::getGrade).orElse(""));
            map.put("marksObtained", sub.map(Submission::getMarksObtained).orElse(null));
            map.put("feedback", sub.map(Submission::getFeedback).orElse(""));
            return map;
        }).collect(Collectors.toList()));

        data.put("notifications", notifications.stream().map(n -> Map.of(
                "id", n.getId(),
                "title", n.getTitle(),
                "message", n.getMessage(),
                "type", n.getType(),
                "read", n.isReadStatus()
        )).collect(Collectors.toList()));

        return data;
    }

    @Cacheable(value = "teacherDashboards", key = "#teacherId")
    public Map<String, Object> getTeacherDashboard(String teacherId) {
        Map<String, Object> data = new HashMap<>();

        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found"));

        List<ClassEntity> classes = classRepository.findByTeacherIdAndDeletedFalse(teacherId);

        List<Map<String, Object>> classList = classes.stream().map(c -> {
            // Count enrolled students
            int studentCount = c.getStudents().size();

            // Fetch assignments for class
            List<Assignment> assignments = assignmentRepository.findByClassEntityIdAndDeletedFalse(c.getId());
            List<String> assignmentIds = assignments.stream().map(Assignment::getId).collect(Collectors.toList());

            // Count submissions needing grading
            long pendingGrading = 0;
            if (!assignmentIds.isEmpty()) {
                List<Submission> submissions = new ArrayList<>();
                for (String assignmentId : assignmentIds) {
                    submissions.addAll(submissionRepository.findByAssignmentIdAndDeletedFalse(assignmentId));
                }
                pendingGrading = submissions.stream()
                        .filter(s -> s.getGrade() == null || s.getGrade().isEmpty())
                        .count();
            }

            Map<String, Object> classMap = new HashMap<>();
            classMap.put("id", c.getId());
            classMap.put("name", c.getName());
            classMap.put("scheduleDays", c.getScheduleDays() != null ? c.getScheduleDays() : "");
            classMap.put("scheduleTime", c.getScheduleTime() != null ? c.getScheduleTime() : "");
            classMap.put("studentCount", studentCount);
            classMap.put("pendingGradingCount", pendingGrading);
            return classMap;
        }).collect(Collectors.toList());

        data.put("profile", Map.of("id", teacher.getId(), "name", teacher.getName(), "email", teacher.getEmail()));
        data.put("classes", classList);

        return data;
    }

    @Cacheable(value = "parentDashboards", key = "#parentId")
    public Map<String, Object> getParentDashboard(String parentId) {
        Map<String, Object> data = new HashMap<>();

        User parent = userRepository.findById(parentId)
                .orElseThrow(() -> new IllegalArgumentException("Parent not found"));

        // Get linked children (students)
        Set<User> children = parent.getStudents();

        List<Map<String, Object>> childrenList = children.stream().map(child -> {
            // Get child dashboard details
            Map<String, Object> childDashboard = getStudentDashboard(child.getId());
            Map<String, Object> childMap = new HashMap<>();
            childMap.put("id", child.getId());
            childMap.put("name", child.getName());
            childMap.put("email", child.getEmail());
            childMap.put("details", childDashboard);
            return childMap;
        }).collect(Collectors.toList());

        data.put("profile", Map.of("id", parent.getId(), "name", parent.getName(), "email", parent.getEmail()));
        data.put("children", childrenList);

        return data;
    }
}
