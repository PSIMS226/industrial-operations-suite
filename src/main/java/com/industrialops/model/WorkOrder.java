package com.industrialops.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "work_orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String workOrderNumber;

    @NotBlank
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkOrderType type = WorkOrderType.CORRECTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkOrderStatus status = WorkOrderStatus.OPEN;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    private String assignedTechnician;
    private LocalDateTime scheduledDate;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Integer estimatedDurationMinutes;
    private Integer actualDurationMinutes;

    @Column(columnDefinition = "TEXT")
    private String completionNotes;

    private Double laborCost;
    private Double partsCost;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum WorkOrderType {
        PREVENTIVE, CORRECTIVE, EMERGENCY, INSPECTION
    }

    public enum WorkOrderStatus {
        OPEN, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}