package com.industrialops.repository;

import com.industrialops.model.Alert;
import com.industrialops.model.Alert.AlertStatus;
import com.industrialops.model.Alert.AlertSeverity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByStatus(AlertStatus status);

    List<Alert> findByStatusOrderByCreatedAtDesc(AlertStatus status);

    List<Alert> findBySeverityAndStatus(AlertSeverity severity, AlertStatus status);

    List<Alert> findByEquipmentId(Long equipmentId);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.status = 'ACTIVE'")
    long countActive();

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.status = 'ACTIVE' AND a.severity = 'CRITICAL'")
    long countActiveCritical();

    @Query("SELECT a.severity, COUNT(a) FROM Alert a WHERE a.status = 'ACTIVE' GROUP BY a.severity")
    List<Object[]> countActiveGroupedBySeverity();
}