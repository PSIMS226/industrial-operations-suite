package com.industrialops.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class KpiSummaryDto {

    private Double avgOee;
    private Double avgAvailability;
    private Double avgPerformance;
    private Double avgQuality;

    private Long totalUnitsProduced;
    private Long totalDefects;
    private Double defectRate;

    private Long totalEquipment;
    private Map<String, Long> equipmentByStatus;

    private Long openWorkOrders;
    private Map<String, Long> workOrdersByStatus;

    private Long totalDowntimeMinutes;
    private Long numberOfDowntimeEvents;

    private Long activeAlerts;
    private Long criticalAlerts;
    private Map<String, Long> alertsBySeverity;

    private List<EquipmentOeeDto> bottomEquipmentByOee;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class EquipmentOeeDto {
        private Long equipmentId;
        private String equipmentName;
        private Double oee;
    }
}