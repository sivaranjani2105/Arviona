package com.arviona.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"classEntity"})
@ToString(exclude = {"classEntity"})
public class Quest {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "reward_xp")
    private int rewardXp = 100;

    @Column(name = "quest_data_json", columnDefinition = "TEXT")
    private String questDataJson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_quest_id")
    private Quest parentQuest;

    @Column(name = "chain_name", length = 100)
    private String chainName;

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
