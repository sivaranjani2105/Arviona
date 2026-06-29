package com.arviona.repository;

import com.arviona.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {
    List<Question> findAllByDeletedFalse();
    List<Question> findBySubjectAndDeletedFalse(String subject);
}
