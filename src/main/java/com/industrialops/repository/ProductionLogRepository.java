package com.industrialops.repository;

import com.industrialops.model.ProductionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductionLogRepository extends JpaRepository<ProductionLog, Long> {

    List<ProductionLog> findByEquipmentId(Long equipmentId);

    List<ProductionLog> findByShiftName(String shiftName);

    List<ProductionLog> findByPeriodStartBetween(LocalDateTime from, LocalDateTime to);

    @Query("""
        SELECT AVG(p.oee), AVG(p.availability), AVG(p.performance), AVG(p.quality),
               SUM(p.producedUnits), SUM(p.defectiveUnits)
        FROM ProductionLog p
        WHERE p.periodStart >= :from AND p.periodEnd <= :to
        """)
    Object[] aggregateKPIs(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("""
        SELECT p.equipment.id, p.equipment.name, AVG(p.oee)
        FROM ProductionLog p
        WHERE p.periodStart >= :from AND p.periodEnd <= :to
        GROUP BY p.equipment.id, p.equipment.name
        ORDER BY AVG(p.oee) ASC
        """)
    List<Object[]> oeePerEquipment(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}