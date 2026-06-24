package com.arviona.repository;

import com.arviona.model.SchoolEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SchoolEventRepository extends JpaRepository<SchoolEvent, String> {
    List<SchoolEvent> findAllByActiveTrueAndDeletedFalse();
}
