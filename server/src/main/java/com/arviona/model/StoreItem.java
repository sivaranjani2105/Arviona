package com.arviona.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "store_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreItem {
    @Id
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Legacy field kept for backward-compat (maps to "type" column)
    @Column(nullable = false, length = 50)
    private String type;

    // Category alias — same semantic as type, used by new controllers
    @Column(length = 50)
    private String category;

    // Old DB column name — kept for flyway compat
    @Column(name = "price_coins")
    private int priceCoins;

    // Price alias exposed by new controllers
    @Transient
    public int getPrice() { return priceCoins; }

    @Column(name = "icon_emoji", length = 10)
    private String iconEmoji;

    @Column(name = "details_json", columnDefinition = "TEXT")
    private String detailsJson;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean deleted = false;
}
