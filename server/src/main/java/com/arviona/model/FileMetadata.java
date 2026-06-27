package com.arviona.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "files")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileMetadata {

    @Id
    private String id;

    @Column(name = "original_name", length = 255)
    private String originalName;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_type", length = 100)
    private String fileType;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "storage_path", length = 512)
    private String storagePath;

    // Teacher written note content
    @Column(columnDefinition = "TEXT")
    private String description;

    // Which student this note/file is for (optional)
    @Column(name = "student_id", length = 36)
    private String studentId;

    // Who uploaded (teacher's userId)
    @Column(name = "uploaded_by", length = 36)
    private String uploadedBy;

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
