package com.industrialops.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "production_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    private String productName;
    private String productCode;
    private String shiftName;
    private String operatorName;

    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;

    private Integer targetUnits;
    private Integer producedUnits;
    private Integer defectiveUnits;
    private Integer scrapUnits;

    private Integer plannedDowntimeMinutes = 0;
    private Integer unplannedDowntimeMinutes = 0;

    private Double availability;
    private Double performance;
    private Double quality;
    private Double oee;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    public void calculateKPIs() {
        if (producedUnits != null && targetUnits != null && targetUnits > 0) {
            int goodUnits = producedUnits - (defectiveUnits != null ? defectiveUnits : 0);
            quality = goodUnits / (double) producedUnits;
            performance = producedUnits / (double) targetUnits;
        }

        if (periodStart != null && periodEnd != null) {
            long scheduledMinutes = java.time.Duration.between(periodStart, periodEnd).toMinutes();
            int downtime = (plannedDowntimeMinutes != null ? plannedDowntimeMinutes : 0)
                    + (unplannedDowntimeMinutes != null ? unplannedDowntimeMinutes : 0);
            if (scheduledMinutes > 0) {
                availability = (scheduledMinutes - downtime) / (double) scheduledMinutes;
            }
        }

        if (availability != null && performance != null && quality != null) {
            oee = availability * performance * quality;
        }
    }
}