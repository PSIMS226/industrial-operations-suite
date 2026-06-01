package com.industrialops.service;

import com.industrialops.model.Equipment;
import com.industrialops.model.Equipment.EquipmentStatus;
import com.industrialops.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;

    public List<Equipment> findAll() {
        return equipmentRepository.findAll();
    }

    public Equipment findById(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found: " + id));
    }

    public List<Equipment> findByStatus(EquipmentStatus status) {
        return equipmentRepository.findByStatus(status);
    }

    public List<Equipment> findOverdueMaintenance() {
        return equipmentRepository.findOverdueMaintenance(LocalDateTime.now());
    }

    @Transactional
    public Equipment create(Equipment equipment) {
        if (equipment.getEquipmentCode() != null) {
            equipmentRepository.findByEquipmentCode(equipment.getEquipmentCode())
                    .ifPresent(e -> { throw new RuntimeException(
                            "Equipment code already exists: " + equipment.getEquipmentCode()); });
        }
        return equipmentRepository.save(equipment);
    }

    @Transactional
    public Equipment update(Long id, Equipment updated) {
        Equipment existing = findById(id);
        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setLocation(updated.getLocation());
        existing.setManufacturer(updated.getManufacturer());
        existing.setModelNumber(updated.getModelNumber());
        existing.setMaintenanceIntervalDays(updated.getMaintenanceIntervalDays());
        existing.setNextMaintenanceDue(updated.getNextMaintenanceDue());
        existing.setNotes(updated.getNotes());
        return equipmentRepository.save(existing);
    }

    @Transactional
    public Equipment updateStatus(Long id, EquipmentStatus status) {
        Equipment equipment = findById(id);
        equipment.setStatus(status);
        return equipmentRepository.save(equipment);
    }

    @Transactional
    public void delete(Long id) {
        Equipment equipment = findById(id);
        equipment.setStatus(EquipmentStatus.DECOMMISSIONED);
        equipmentRepository.save(equipment);
    }

    public List<Object[]> getStatusCounts() {
        return equipmentRepository.countByStatus();
    }
}