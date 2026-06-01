package com.industrialops.service;

import com.industrialops.model.WorkOrder;
import com.industrialops.model.WorkOrder.WorkOrderStatus;
import com.industrialops.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;

    public List<WorkOrder> findAll() {
        return workOrderRepository.findAll();
    }

    public WorkOrder findById(Long id) {
        return workOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work order not found: " + id));
    }

    public List<WorkOrder> findByStatus(WorkOrderStatus status) {
        return workOrderRepository.findByStatus(status);
    }

    public List<WorkOrder> findByEquipment(Long equipmentId) {
        return workOrderRepository.findByEquipmentId(equipmentId);
    }

    public List<WorkOrder> findOverdue() {
        return workOrderRepository.findOverdue(LocalDateTime.now());
    }

    @Transactional
    public WorkOrder create(WorkOrder workOrder) {
        workOrder.setWorkOrderNumber(generateWONumber());
        workOrder.setStatus(WorkOrderStatus.OPEN);
        return workOrderRepository.save(workOrder);
    }

    @Transactional
    public WorkOrder update(Long id, WorkOrder updated) {
        WorkOrder existing = findById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setType(updated.getType());
        existing.setPriority(updated.getPriority());
        existing.setAssignedTechnician(updated.getAssignedTechnician());
        existing.setScheduledDate(updated.getScheduledDate());
        existing.setEstimatedDurationMinutes(updated.getEstimatedDurationMinutes());
        return workOrderRepository.save(existing);
    }

    @Transactional
    public WorkOrder startWork(Long id) {
        WorkOrder wo = findById(id);
        wo.setStatus(WorkOrderStatus.IN_PROGRESS);
        wo.setStartedAt(LocalDateTime.now());
        return workOrderRepository.save(wo);
    }

    @Transactional
    public WorkOrder complete(Long id, String completionNotes, Double laborCost, Double partsCost) {
        WorkOrder wo = findById(id);
        wo.setStatus(WorkOrderStatus.COMPLETED);
        wo.setCompletedAt(LocalDateTime.now());
        wo.setCompletionNotes(completionNotes);
        wo.setLaborCost(laborCost);
        wo.setPartsCost(partsCost);

        if (wo.getStartedAt() != null) {
            long minutes = java.time.Duration.between(wo.getStartedAt(), wo.getCompletedAt()).toMinutes();
            wo.setActualDurationMinutes((int) minutes);
        }

        if (wo.getType() == WorkOrder.WorkOrderType.PREVENTIVE && wo.getEquipment() != null) {
            wo.getEquipment().setLastMaintenanceDate(LocalDateTime.now());
        }

        return workOrderRepository.save(wo);
    }

    @Transactional
    public WorkOrder cancel(Long id) {
        WorkOrder wo = findById(id);
        wo.setStatus(WorkOrderStatus.CANCELLED);
        return workOrderRepository.save(wo);
    }

    public List<Object[]> getStatusCounts() {
        return workOrderRepository.countByStatus();
    }

    private String generateWONumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 5).toUpperCase();
        return "WO-" + date + "-" + suffix;
    }
}