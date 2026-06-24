package com.arviona.repository;

import com.arviona.model.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, String> {
    List<Lecture> findByClassEntityIdAndDeletedFalse(String classId);
}
