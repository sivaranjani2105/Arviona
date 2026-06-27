package com.arviona.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "weekly_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyReport {
    @Id
    private String id;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "student_name", length = 200)
    private String studentName;

    @Column(name = "teacher_id", nullable = false)
    private String teacherId;

    @Column(name = "teacher_name", length = 200)
    private String teacherName;

    @Column(name = "teacher_notes", columnDefinition = "TEXT")
    private String teacherNotes;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(name = "weak_topics", columnDefinition = "TEXT")
    private String weakTopics;

    @Column(name = "xp_this_week")
    @Builder.Default
    private int xpThisWeek = 0;

    @Column(name = "sent_to_parent")
    @Builder.Default
    private boolean sentToParent = false;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "is_deleted")
    @Builder.Default
    private boolean deleted = false;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;
}
