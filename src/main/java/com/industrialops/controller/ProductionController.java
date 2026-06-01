package com.industrialops.controller;

import com.industrialops.dto.ApiResponse;
import com.industrialops.dto.KpiSummaryDto;
import com.industrialops.model.ProductionLog;
import com.industrialops.service.ProductionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/production")
@RequiredArgsConstructor
public class ProductionController {

    private final ProductionService productionService;

    @GetMapping("/logs")
    public ResponseEntity<ApiResponse<List<ProductionLog>>> getLogs(
            @RequestParam(required = false) Long equipmentId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {

        List<ProductionLog> result;
        if (equipmentId != null) {
            result = productionService.findByEquipment(equipmentId);
        } else if (from != null && to != null) {
            result = productionService.findByDateRange(from, to);
        } else {
            result = productionService.findAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/logs/{id}")
    public ResponseEntity<ApiResponse<ProductionLog>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productionService.findById(id)));
    }

    @GetMapping("/kpis")
    public ResponseEntity<ApiResponse<KpiSummaryDto>> getKpis(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {

        LocalDateTime rangeEnd   = to   != null ? to   : LocalDateTime.now();
        LocalDateTime rangeStart = from != null ? from : rangeEnd.minusDays(30);

        KpiSummaryDto kpis = productionService.buildKpiSummary(rangeStart, rangeEnd);
        return ResponseEntity.ok(ApiResponse.ok(kpis));
    }

    @PostMapping("/logs")
    public ResponseEntity<ApiResponse<ProductionLog>> create(@Valid @RequestBody ProductionLog log) {
        ProductionLog created = productionService.create(log);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Production log created"));
    }

    @PutMapping("/logs/{id}")
    public ResponseEntity<ApiResponse<ProductionLog>> update(
            @PathVariable Long id, @Valid @RequestBody ProductionLog log) {
        return ResponseEntity.ok(ApiResponse.ok(productionService.update(id, log)));
    }
}