package com.arviona.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "boss_battles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BossBattle {

    @Id
    private String id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 100)
    private String subject;

    @Column(length = 50)
    private String difficulty = "MEDIUM";

    @Column(name = "time_limit_mins")
    private int timeLimitMins = 30;

    @Column(name = "total_questions")
    private int totalQuestions = 10;

    @Column(name = "xp_reward")
    private int xpReward = 300;

    @Column(name = "coins_reward")
    private int coinsReward = 100;

    @Column(name = "class_id")
    private String classId;

    @Column(name = "created_by_teacher")
    private String createdByTeacher;

    @Column(name = "is_active")
    private boolean active = true;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;
}
