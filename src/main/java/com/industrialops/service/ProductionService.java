package com.industrialops.service;

import com.industrialops.dto.KpiSummaryDto;
import com.industrialops.model.ProductionLog;
import com.industrialops.repository.ProductionLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductionService {

    private final ProductionLogRepository productionLogRepository;

    public List<ProductionLog> findAll() {
        return productionLogRepository.findAll();
    }

    public ProductionLog findById(Long id) {
        return productionLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Production log not found: " + id));
    }

    public List<ProductionLog> findByEquipment(Long equipmentId) {
        return productionLogRepository.findByEquipmentId(equipmentId);
    }

    public List<ProductionLog> findByDateRange(LocalDateTime from, LocalDateTime to) {
        return productionLogRepository.findByPeriodStartBetween(from, to);
    }

    @Transactional
    public ProductionLog create(ProductionLog log) {
        return productionLogRepository.save(log);
    }

    @Transactional
    public ProductionLog update(Long id, ProductionLog updated) {
        ProductionLog existing = findById(id);
        existing.setProducedUnits(updated.getProducedUnits());
        existing.setDefectiveUnits(updated.getDefectiveUnits());
        existing.setScrapUnits(updated.getScrapUnits());
        existing.setPlannedDowntimeMinutes(updated.getPlannedDowntimeMinutes());
        existing.setUnplannedDowntimeMinutes(updated.getUnplannedDowntimeMinutes());
        existing.setNotes(updated.getNotes());
        return productionLogRepository.save(existing);
    }

    public KpiSummaryDto buildKpiSummary(LocalDateTime from, LocalDateTime to) {
        List<Object[]> aggList = productionLogRepository.aggregateKPIs(from, to);
        Object[] agg = aggList.isEmpty() ? new Object[6] : aggList.get(0);

        Double avgOee          = agg[0] != null ? ((Number) agg[0]).doubleValue() : null;
        Double avgAvailability = agg[1] != null ? ((Number) agg[1]).doubleValue() : null;
        Double avgPerformance  = agg[2] != null ? ((Number) agg[2]).doubleValue() : null;
        Double avgQuality      = agg[3] != null ? ((Number) agg[3]).doubleValue() : null;
        Long totalProduced     = agg[4] != null ? ((Number) agg[4]).longValue()   : 0L;
        Long totalDefects      = agg[5] != null ? ((Number) agg[5]).longValue()   : 0L;

        List<Object[]> rawEquip = productionLogRepository.oeePerEquipment(from, to);
        List<KpiSummaryDto.EquipmentOeeDto> bottomEquip = new ArrayList<>();
        for (Object[] row : rawEquip) {
            bottomEquip.add(KpiSummaryDto.EquipmentOeeDto.builder()
                    .equipmentId(((Number) row[0]).longValue())
                    .equipmentName((String) row[1])
                    .oee(row[2] != null ? ((Number) row[2]).doubleValue() : null)
                    .build());
            if (bottomEquip.size() >= 5) break;
        }

        return KpiSummaryDto.builder()
                .avgOee(avgOee)
                .avgAvailability(avgAvailability)
                .avgPerformance(avgPerformance)
                .avgQuality(avgQuality)
                .totalUnitsProduced(totalProduced)
                .totalDefects(totalDefects)
                .defectRate(totalProduced > 0 ? (double) totalDefects / totalProduced : null)
                .bottomEquipmentByOee(bottomEquip)
                .build();
    }
}
