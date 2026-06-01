package com.industrialops.controller;

import com.industrialops.dto.ApiResponse;
import com.industrialops.model.Alert;
import com.industrialops.model.Alert.AlertStatus;
import com.industrialops.service.AlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Alert>>> getAll(
            @RequestParam(required = false) AlertStatus status) {
        List<Alert> result = status != null
                ? alertService.findByStatus(status)
                : alertService.findAll();
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Alert>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(alertService.findById(id)));
    }

    @GetMapping("/counts")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getCounts() {
        Map<String, Long> counts = Map.of(
                "active",   alertService.countActive(),
                "critical", alertService.countActiveCritical()
        );
        return ResponseEntity.ok(ApiResponse.ok(counts));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Alert>> create(@Valid @RequestBody Alert alert) {
        Alert created = alertService.create(alert);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Alert created"));
    }

    @PutMapping("/{id}/acknowledge")
    public ResponseEntity<ApiResponse<Alert>> acknowledge(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String ackBy = body.getOrDefault("acknowledgedBy", "system");
        return ResponseEntity.ok(ApiResponse.ok(
                alertService.acknowledge(id, ackBy), "Alert acknowledged"));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<Alert>> resolve(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String resolvedBy = body.getOrDefault("resolvedBy", "system");
        String notes      = body.getOrDefault("resolutionNotes", "");
        return ResponseEntity.ok(ApiResponse.ok(
                alertService.resolve(id, resolvedBy, notes), "Alert resolved"));
    }
}