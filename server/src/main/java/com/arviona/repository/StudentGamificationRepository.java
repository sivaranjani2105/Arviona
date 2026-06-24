package com.arviona.repository;

import com.arviona.model.StudentGamification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StudentGamificationRepository extends JpaRepository<StudentGamification, String> {
    Optional<StudentGamification> findByUserIdAndDeletedFalse(String userId);
}
