package com.arviona.repository;

import com.arviona.model.StudentDailyJourney;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface StudentDailyJourneyRepository extends JpaRepository<StudentDailyJourney, String> {
    Optional<StudentDailyJourney> findByStudentIdAndJourneyDateAndDeletedFalse(String studentId, LocalDate journeyDate);
}
