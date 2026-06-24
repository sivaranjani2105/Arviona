package com.arviona.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quests_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"quest", "student"})
@ToString(exclude = {"quest", "student"})
public class QuestSubmission {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quest_id", nullable = false)
    private Quest quest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "submission_url", length = 512)
    private String submissionUrl;

    @Column(name = "completed_steps_json", columnDefinition = "TEXT")
    private String completedStepsJson;

    @Column(name = "completed_at")
    private LocalDateTime completedAt = LocalDateTime.now();

    @Column(name = "is_graded")
    private boolean graded = false;

    @Column(name = "grade_assigned", length = 5)
    private String gradeAssigned;

    @Column(name = "marks_obtained")
    private Integer marksObtained;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;
}
