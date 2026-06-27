package com.arviona.repository;

import com.arviona.model.BossBattle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BossBattleRepository extends JpaRepository<BossBattle, String> {
    List<BossBattle> findAllByActiveTrueAndDeletedFalse();
    List<BossBattle> findAllByClassIdAndDeletedFalse(String classId);
}
