package com.arviona.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    private String id;

    // Store both the FK object and a plain string ID for flexibility
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Convenience field — set this when you only have the ID string
    // It must match the user.id above when user is also set
    @Transient
    private String userId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(name = "read_status")
    private boolean readStatus = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @Column(name = "is_deleted")
    private boolean deleted = false;
}
