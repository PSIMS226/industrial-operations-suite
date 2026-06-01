package com.industrialops.repository;

import com.industrialops.model.Equipment;
import com.industrialops.model.Equipment.EquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    Optional<Equipment> findByEquipmentCode(String equipmentCode);

    List<Equipment> findByStatus(EquipmentStatus status);

    List<Equipment> findByLocation(String location);

    List<Equipment> findByType(String type);

    @Query("SELECT e FROM Equipment e WHERE e.nextMaintenanceDue < :now AND e.status = 'OPERATIONAL'")
    List<Equipment> findOverdueMaintenance(LocalDateTime now);

    @Query("SELECT e.status, COUNT(e) FROM Equipment e GROUP BY e.status")
    List<Object[]> countByStatus();
}