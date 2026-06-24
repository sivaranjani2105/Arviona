package com.arviona.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"student", "storeItem"})
@ToString(exclude = {"student", "storeItem"})
public class StudentInventory {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private StoreItem storeItem;

    @Column(name = "is_equipped", nullable = false)
    @Builder.Default
    private boolean equipped = false;

    @Column(name = "unlocked_at")
    @Builder.Default
    private LocalDateTime unlockedAt = LocalDateTime.now();
}
