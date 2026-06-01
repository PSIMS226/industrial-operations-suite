package com.industrialops.service;

import com.industrialops.model.Alert;
import com.industrialops.model.Alert.AlertStatus;
import com.industrialops.model.Alert.AlertSeverity;
import com.industrialops.model.Alert.AlertType;
import com.industrialops.model.Equipment;
import com.industrialops.model.InventoryItem;
import com.industrialops.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AlertService {

    private final AlertRepository alertRepository;

    public List<Alert> findAll() {
        return alertRepository.findByStatusOrderByCreatedAtDesc(AlertStatus.ACTIVE);
    }

    public List<Alert> findByStatus(AlertStatus status) {
        return alertRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Alert findById(Long id) {
        return alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found: " + id));
    }

    @Transactional
    public Alert create(Alert alert) {
        return alertRepository.save(alert);
    }

    @Transactional
    public Alert acknowledge(Long id, String acknowledgedBy) {
        Alert alert = findById(id);
        alert.setStatus(AlertStatus.ACKNOWLEDGED);
        alert.setAcknowledgedAt(LocalDateTime.now());
        alert.setAcknowledgedBy(acknowledgedBy);
        return alertRepository.save(alert);
    }

    @Transactional
    public Alert resolve(Long id, String resolvedBy, String notes) {
        Alert alert = findById(id);
        alert.setStatus(AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());
        alert.setResolvedBy(resolvedBy);
        alert.setResolutionNotes(notes);
        return alertRepository.save(alert);
    }

    @Transactional
    public void createLowInventoryAlert(InventoryItem item) {
        Alert alert = Alert.builder()
                .title("Low Stock: " + item.getName())
                .message(String.format("Item '%s' (SKU: %s) has %d units remaining, at or below reorder point of %d.",
                        item.getName(), item.getSku(), item.getQuantityOnHand(), item.getReorderPoint()))
                .severity(item.getQuantityOnHand() == 0 ? AlertSeverity.CRITICAL : AlertSeverity.WARNING)
                .type(AlertType.LOW_INVENTORY)
                .status(AlertStatus.ACTIVE)
                .sourceSystem("INVENTORY")
                .build();
        alertRepository.save(alert);
    }

    @Transactional
    public void createMaintenanceDueAlert(Equipment equipment) {
        Alert alert = Alert.builder()
                .title("Maintenance Due: " + equipment.getName())
                .message(String.format("Equipment '%s' (%s) is due for scheduled maintenance.",
                        equipment.getName(), equipment.getEquipmentCode()))
                .severity(AlertSeverity.WARNING)
                .type(AlertType.MAINTENANCE_DUE)
                .status(AlertStatus.ACTIVE)
                .equipment(equipment)
                .sourceSystem("MAINTENANCE")
                .build();
        alertRepository.save(alert);
    }

    public long countActive() {
        return alertRepository.countActive();
    }

    public long countActiveCritical() {
        return alertRepository.countActiveCritical();
    }
}
