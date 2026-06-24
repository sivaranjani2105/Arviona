package com.arviona.repository;

import com.arviona.model.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, String> {
    List<ClassEntity> findByTeacherIdAndDeletedFalse(String teacherId);
    
    @Query("SELECT c FROM ClassEntity c JOIN c.students s WHERE s.id = :studentId AND c.deleted = false")
    List<ClassEntity> findByStudentIdAndDeletedFalse(@Param("studentId") String studentId);
}
