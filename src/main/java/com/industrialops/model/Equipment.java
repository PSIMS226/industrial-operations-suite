package com.industrialops.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "equipment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String equipmentCode;

    private String type;
    private String location;
    private String manufacturer;
    private String modelNumber;
    private String serialNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EquipmentStatus status = EquipmentStatus.OPERATIONAL;

    private LocalDateTime installationDate;
    private LocalDateTime lastMaintenanceDate;
    private LocalDateTime nextMaintenanceDue;
    private Integer maintenanceIntervalDays;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum EquipmentStatus {
        OPERATIONAL,
        UNDER_MAINTENANCE,
        OFFLINE,
        DECOMMISSIONED
    }
}