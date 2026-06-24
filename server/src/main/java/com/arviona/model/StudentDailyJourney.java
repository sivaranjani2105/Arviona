package com.arviona.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_daily_journeys", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "journey_date"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"student"})
@ToString(exclude = {"student"})
public class StudentDailyJourney {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "journey_date", nullable = false)
    private LocalDate journeyDate;

    @Column(name = "mission_1_completed", nullable = false)
    @Builder.Default
    private boolean mission1Completed = false;

    @Column(name = "mission_2_completed", nullable = false)
    @Builder.Default
    private boolean mission2Completed = false;

    @Column(name = "mission_3_completed", nullable = false)
    @Builder.Default
    private boolean mission3Completed = false;

    @Column(name = "daily_bonus_claimed", nullable = false)
    @Builder.Default
    private boolean dailyBonusClaimed = false;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean deleted = false;
}
