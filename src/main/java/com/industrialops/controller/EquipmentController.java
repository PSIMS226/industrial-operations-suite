package com.industrialops.controller;

import com.industrialops.dto.ApiResponse;
import com.industrialops.model.Equipment;
import com.industrialops.model.Equipment.EquipmentStatus;
import com.industrialops.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Equipment>>> getAll(
            @RequestParam(required = false) EquipmentStatus status) {
        List<Equipment> result = status != null
                ? equipmentService.findByStatus(status)
                : equipmentService.findAll();
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Equipment>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(equipmentService.findById(id)));
    }

    @GetMapping("/overdue-maintenance")
    public ResponseEntity<ApiResponse<List<Equipment>>> getOverdueMaintenance() {
        return ResponseEntity.ok(ApiResponse.ok(equipmentService.findOverdueMaintenance()));
    }

    @GetMapping("/status-summary")
    public ResponseEntity<ApiResponse<List<Object[]>>> getStatusSummary() {
        return ResponseEntity.ok(ApiResponse.ok(equipmentService.getStatusCounts()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Equipment>> create(@Valid @RequestBody Equipment equipment) {
        Equipment created = equipmentService.create(equipment);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Equipment created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Equipment>> update(
            @PathVariable Long id, @Valid @RequestBody Equipment equipment) {
        return ResponseEntity.ok(ApiResponse.ok(equipmentService.update(id, equipment)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Equipment>> updateStatus(
            @PathVariable Long id, @RequestParam EquipmentStatus status) {
        return ResponseEntity.ok(ApiResponse.ok(
                equipmentService.updateStatus(id, status), "Status updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        equipmentService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Equipment decommissioned"));
    }
}