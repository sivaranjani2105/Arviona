package com.arviona.repository;

import com.arviona.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, String> {
    List<Grade> findByStudentIdAndDeletedFalse(String studentId);
    List<Grade> findByClassEntityIdAndDeletedFalse(String classId);
}
