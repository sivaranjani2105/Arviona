package com.arviona.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_gamification")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"user", "house"})
@ToString(exclude = {"user", "house"})
public class StudentGamification {
    @Id
    @Column(name = "user_id")
    private String userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private int level = 1;

    @Column(name = "xp_total")
    private int xpTotal = 0;

    @Column(name = "xp_next_level")
    private int xpNextLevel = 1000;

    @Column(name = "current_streak")
    private int currentStreak = 0;

    @Column(name = "coins_balance")
    @Builder.Default
    private int coinsBalance = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "house_id")
    private House house;

    @Column(name = "streak_last_activity")
    private LocalDateTime streakLastActivity;

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
