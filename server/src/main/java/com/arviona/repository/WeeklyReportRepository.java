package com.arviona.repository;

import com.arviona.model.WeeklyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WeeklyReportRepository extends JpaRepository<WeeklyReport, String> {
    List<WeeklyReport> findByTeacherIdAndDeletedFalseOrderByCreatedAtDesc(String teacherId);
    List<WeeklyReport> findByStudentIdAndSentToParentTrueAndDeletedFalseOrderByCreatedAtDesc(String studentId);
    List<WeeklyReport> findByStudentIdAndDeletedFalseOrderByCreatedAtDesc(String studentId);
}
