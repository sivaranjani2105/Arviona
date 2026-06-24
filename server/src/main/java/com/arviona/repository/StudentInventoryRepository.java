package com.arviona.repository;

import com.arviona.model.StudentInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentInventoryRepository extends JpaRepository<StudentInventory, String> {
    List<StudentInventory> findAllByStudentId(String studentId);
    Optional<StudentInventory> findByStudentIdAndStoreItemId(String studentId, String storeItemId);
}
