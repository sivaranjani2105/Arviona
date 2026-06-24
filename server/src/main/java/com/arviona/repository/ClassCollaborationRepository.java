package com.arviona.repository;

import com.arviona.model.ClassCollaboration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClassCollaborationRepository extends JpaRepository<ClassCollaboration, String> {
    List<ClassCollaboration> findAllByClassEntityIdAndActiveTrueAndDeletedFalse(String classId);
}
