package com.industrialops.repository;

import com.industrialops.model.ShiftReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftReportRepository extends JpaRepository<ShiftReport, Long> {

    Optional<ShiftReport> findByReportDateAndShiftName(LocalDate date, String shiftName);

    List<ShiftReport> findByReportDateBetween(LocalDate from, LocalDate to);

    List<ShiftReport> findByShiftNameAndReportDateBetween(String shiftName, LocalDate from, LocalDate to);

    List<ShiftReport> findBySupervisorName(String supervisorName);

    List<ShiftReport> findByStatus(ShiftReport.ReportStatus status);
}
