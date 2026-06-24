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
@EqualsAndHashCode(exclude = {"classEntity"})
@ToString(exclude = {"classEntity"})
public class BossBattle {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "time_limit_seconds")
    private int timeLimitSeconds = 1800;

    @Column(name = "reward_xp")
    private int rewardXp = 300;

    @Column(length = 50)
    private String difficulty = "MEDIUM";

    @Column(name = "questions_pool_json", columnDefinition = "TEXT")
    private String questionsPoolJson;

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
