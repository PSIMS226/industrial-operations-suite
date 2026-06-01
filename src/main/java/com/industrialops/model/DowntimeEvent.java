package com.industrialops.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "downtime_events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DowntimeEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DowntimeCategory category;

    private String reason;

    @Column(columnDefinition = "TEXT")
    private String rootCause;

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer durationMinutes;

    private String reportedBy;
    private String resolvedBy;

    @Enumerated(EnumType.STRING)
    private DowntimeStatus status = DowntimeStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_order_id")
    private WorkOrder linkedWorkOrder;

    @Column(columnDefinition = "TEXT")
    private String correctionTaken;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    public void computeDuration() {
        if (startTime != null && endTime != null) {
            durationMinutes = (int) java.time.Duration.between(startTime, endTime).toMinutes();
        }
        if (endTime != null && status == DowntimeStatus.OPEN) {
            status = DowntimeStatus.RESOLVED;
        }
    }

    public enum DowntimeCategory {
        PLANNED_MAINTENANCE,
        UNPLANNED_BREAKDOWN,
        CHANGEOVER,
        NO_MATERIAL,
        NO_OPERATOR,
        QUALITY_ISSUE,
        PROCESS_ISSUE,
        UTILITY_FAILURE,
        OTHER
    }

    public enum DowntimeStatus {
        OPEN, IN_PROGRESS, RESOLVED
    }
}