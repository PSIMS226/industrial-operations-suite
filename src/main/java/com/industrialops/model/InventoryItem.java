package com.industrialops.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String sku;

    @NotBlank
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;
    private String unitOfMeasure;

    @Min(0)
    private Integer quantityOnHand = 0;

    @Min(0)
    private Integer reorderPoint = 0;

    @Min(0)
    private Integer reorderQuantity = 0;

    private Double unitCost;
    private String supplier;
    private String supplierPartNumber;
    private String storageLocation;

    @Column(nullable = false)
    private Boolean active = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Transient
    public boolean isLowStock() {
        return quantityOnHand != null && reorderPoint != null
                && quantityOnHand <= reorderPoint;
    }
}