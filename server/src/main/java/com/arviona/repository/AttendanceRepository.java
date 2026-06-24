package com.arviona.repository;

import com.arviona.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    List<Attendance> findByStudentIdAndDeletedFalse(String studentId);
    List<Attendance> findByClassEntityIdAndAttendanceDateAndDeletedFalse(String classId, LocalDate date);
    List<Attendance> findByClassEntityIdAndDeletedFalse(String classId);
}
