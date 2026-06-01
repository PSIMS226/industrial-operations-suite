package com.industrialops.controller;

import com.industrialops.dto.ApiResponse;
import com.industrialops.model.WorkOrder;
import com.industrialops.model.WorkOrder.WorkOrderStatus;
import com.industrialops.service.WorkOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workorders")
@RequiredArgsConstructor
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkOrder>>> getAll(
            @RequestParam(required = false) WorkOrderStatus status,
            @RequestParam(required = false) Long equipmentId) {

        List<WorkOrder> result;
        if (equipmentId != null) {
            result = workOrderService.findByEquipment(equipmentId);
        } else if (status != null) {
            result = workOrderService.findByStatus(status);
        } else {
            result = workOrderService.findAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkOrder>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(workOrderService.findById(id)));
    }

    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<WorkOrder>>> getOverdue() {
        return ResponseEntity.ok(ApiResponse.ok(workOrderService.findOverdue()));
    }

    @GetMapping("/status-summary")
    public ResponseEntity<ApiResponse<List<Object[]>>> getStatusSummary() {
        return ResponseEntity.ok(ApiResponse.ok(workOrderService.getStatusCounts()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WorkOrder>> create(@Valid @RequestBody WorkOrder workOrder) {
        WorkOrder created = workOrderService.create(workOrder);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Work order created: " + created.getWorkOrderNumber()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkOrder>> update(
            @PathVariable Long id, @Valid @RequestBody WorkOrder workOrder) {
        return ResponseEntity.ok(ApiResponse.ok(workOrderService.update(id, workOrder)));
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<ApiResponse<WorkOrder>> start(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(workOrderService.startWork(id), "Work started"));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<WorkOrder>> complete(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {

        String notes     = (String)  body.getOrDefault("completionNotes", "");
        Double laborCost = body.get("laborCost") != null ? ((Number) body.get("laborCost")).doubleValue() : null;
        Double partsCost = body.get("partsCost") != null ? ((Number) body.get("partsCost")).doubleValue() : null;

        return ResponseEntity.ok(ApiResponse.ok(
                workOrderService.complete(id, notes, laborCost, partsCost), "Work order completed"));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<WorkOrder>> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(workOrderService.cancel(id), "Work order cancelled"));
    }
}