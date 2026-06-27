package com.arviona.repository;

import com.arviona.model.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, String> {
    List<FileMetadata> findByUploadedByAndDeletedFalse(String uploadedBy);
    List<FileMetadata> findByStudentIdAndDeletedFalse(String studentId);
}
