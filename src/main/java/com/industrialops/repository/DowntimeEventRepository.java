package com.industrialops.repository;

import com.industrialops.model.DowntimeEvent;
import com.industrialops.model.DowntimeEvent.DowntimeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DowntimeEventRepository extends JpaRepository<DowntimeEvent, Long> {

    List<DowntimeEvent> findByEquipmentId(Long equipmentId);

    List<DowntimeEvent> findByStatus(DowntimeStatus status);

    @Query("SELECT d FROM DowntimeEvent d WHERE d.endTime IS NULL")
    List<DowntimeEvent> findOngoing();

    List<DowntimeEvent> findByStartTimeBetween(LocalDateTime from, LocalDateTime to);

    @Query("""
        SELECT d.equipment.id, d.equipment.name,
               SUM(d.durationMinutes), COUNT(d)
        FROM DowntimeEvent d
        WHERE d.startTime >= :from AND d.startTime <= :to
          AND d.durationMinutes IS NOT NULL
        GROUP BY d.equipment.id, d.equipment.name
        ORDER BY SUM(d.durationMinutes) DESC
        """)
    List<Object[]> downtimeSummaryByEquipment(@Param("from") LocalDateTime from,
                                              @Param("to") LocalDateTime to);

    @Query("""
        SELECT d.category, SUM(d.durationMinutes), COUNT(d)
        FROM DowntimeEvent d
        WHERE d.startTime >= :from AND d.startTime <= :to
        GROUP BY d.category
        """)
    List<Object[]> downtimeByCategory(@Param("from") LocalDateTime from,
                                      @Param("to") LocalDateTime to);
}