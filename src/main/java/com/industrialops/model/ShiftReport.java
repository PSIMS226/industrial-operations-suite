package com.industrialops.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "shift_reports",
        uniqueConstraints = @UniqueConstraint(columnNames = {"report_date", "shift_name"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ShiftReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate reportDate;

    @Column(name = "shift_name", nullable = false)
    private String shiftName;

    private String supervisorName;

    private Integer totalUnitsProduced;
    private Integer totalDefects;
    private Double overallOee;

    private Integer totalDowntimeMinutes;
    private Integer numberOfIncidents;

    private Integer workOrdersOpened;
    private Integer workOrdersCompleted;

    private Integer safetyIncidents;
    private Boolean safetyBriefingConducted;

    @Column(columnDefinition = "TEXT")
    private String highlights;

    @Column(columnDefinition = "TEXT")
    private String issues;

    @Column(columnDefinition = "TEXT")
    private String actionsRequired;

    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.DRAFT;

    private LocalDateTime submittedAt;
    private String submittedBy;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum ReportStatus {
        DRAFT, SUBMITTED, REVIEWED, APPROVED
    }
}