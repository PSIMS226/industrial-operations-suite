package com.industrialops.service;

import com.industrialops.model.ShiftReport;
import com.industrialops.model.ShiftReport.ReportStatus;
import com.industrialops.repository.ShiftReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShiftReportService {

    private final ShiftReportRepository shiftReportRepository;

    public List<ShiftReport> findAll() {
        return shiftReportRepository.findAll();
    }

    public ShiftReport findById(Long id) {
        return shiftReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift report not found: " + id));
    }

    public List<ShiftReport> findByDateRange(LocalDate from, LocalDate to) {
        return shiftReportRepository.findByReportDateBetween(from, to);
    }

    @Transactional
    public ShiftReport create(ShiftReport report) {
        shiftReportRepository.findByReportDateAndShiftName(report.getReportDate(), report.getShiftName())
                .ifPresent(r -> { throw new RuntimeException(
                        "Report already exists for " + report.getShiftName() + " on " + report.getReportDate()); });
        report.setStatus(ReportStatus.DRAFT);
        return shiftReportRepository.save(report);
    }

    @Transactional
    public ShiftReport update(Long id, ShiftReport updated) {
        ShiftReport existing = findById(id);
        if (existing.getStatus() == ReportStatus.APPROVED) {
            throw new RuntimeException("Cannot edit an approved report.");
        }
        existing.setSupervisorName(updated.getSupervisorName());
        existing.setTotalUnitsProduced(updated.getTotalUnitsProduced());
        existing.setTotalDefects(updated.getTotalDefects());
        existing.setOverallOee(updated.getOverallOee());
        existing.setTotalDowntimeMinutes(updated.getTotalDowntimeMinutes());
        existing.setNumberOfIncidents(updated.getNumberOfIncidents());
        existing.setWorkOrdersOpened(updated.getWorkOrdersOpened());
        existing.setWorkOrdersCompleted(updated.getWorkOrdersCompleted());
        existing.setSafetyIncidents(updated.getSafetyIncidents());
        existing.setSafetyBriefingConducted(updated.getSafetyBriefingConducted());
        existing.setHighlights(updated.getHighlights());
        existing.setIssues(updated.getIssues());
        existing.setActionsRequired(updated.getActionsRequired());
        return shiftReportRepository.save(existing);
    }

    @Transactional
    public ShiftReport submit(Long id, String submittedBy) {
        ShiftReport report = findById(id);
        report.setStatus(ReportStatus.SUBMITTED);
        report.setSubmittedAt(LocalDateTime.now());
        report.setSubmittedBy(submittedBy);
        return shiftReportRepository.save(report);
    }

    @Transactional
    public ShiftReport approve(Long id) {
        ShiftReport report = findById(id);
        if (report.getStatus() != ReportStatus.SUBMITTED) {
            throw new RuntimeException("Only submitted reports can be approved.");
        }
        report.setStatus(ReportStatus.APPROVED);
        return shiftReportRepository.save(report);
    }
}