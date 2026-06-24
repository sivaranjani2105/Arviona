package com.arviona.repository;

import com.arviona.model.StudentPet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentPetRepository extends JpaRepository<StudentPet, String> {
    List<StudentPet> findAllByStudentIdAndDeletedFalse(String studentId);
    Optional<StudentPet> findByStudentIdAndDeletedFalse(String studentId);
}
