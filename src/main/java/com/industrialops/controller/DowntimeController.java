package com.industrialops.controller;

import com.industrialops.dto.ApiResponse;
import com.industrialops.model.DowntimeEvent;
import com.industrialops.service.DowntimeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/downtime")
@RequiredArgsConstructor
public class DowntimeController {

    private final DowntimeService downtimeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DowntimeEvent>>> getAll(
            @RequestParam(required = false) Long equipmentId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {

        List<DowntimeEvent> result;
        if (equipmentId != null) {
            result = downtimeService.findByEquipment(equipmentId);
        } else if (from != null && to != null) {
            result = downtimeService.findByDateRange(from, to);
        } else {
            result = downtimeService.findAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DowntimeEvent>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(downtimeService.findById(id)));
    }

    @GetMapping("/ongoing")
    public ResponseEntity<ApiResponse<List<DowntimeEvent>>> getOngoing() {
        return ResponseEntity.ok(ApiResponse.ok(downtimeService.findOngoing()));
    }

    @GetMapping("/summary/equipment")
    public ResponseEntity<ApiResponse<List<Object[]>>> getSummaryByEquipment(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return ResponseEntity.ok(ApiResponse.ok(downtimeService.getSummaryByEquipment(from, to)));
    }

    @GetMapping("/summary/category")
    public ResponseEntity<ApiResponse<List<Object[]>>> getSummaryByCategory(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return ResponseEntity.ok(ApiResponse.ok(downtimeService.getSummaryByCategory(from, to)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DowntimeEvent>> start(@Valid @RequestBody DowntimeEvent event) {
        DowntimeEvent created = downtimeService.startEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Downtime event started"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DowntimeEvent>> update(
            @PathVariable Long id, @Valid @RequestBody DowntimeEvent event) {
        return ResponseEntity.ok(ApiResponse.ok(downtimeService.update(id, event)));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<DowntimeEvent>> resolve(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String resolvedBy      = body.getOrDefault("resolvedBy", "");
        String correctionTaken = body.getOrDefault("correctionTaken", "");
        return ResponseEntity.ok(ApiResponse.ok(
                downtimeService.resolveEvent(id, resolvedBy, correctionTaken),
                "Downtime event resolved"));
    }
}