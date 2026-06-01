package com.industrialops.controller;

import com.industrialops.dto.ApiResponse;
import com.industrialops.model.ShiftReport;
import com.industrialops.service.ShiftReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shiftreports")
@RequiredArgsConstructor
public class ShiftReportController {

    private final ShiftReportService shiftReportService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShiftReport>>> getAll(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        List<ShiftReport> result = (from != null && to != null)
                ? shiftReportService.findByDateRange(from, to)
                : shiftReportService.findAll();
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShiftReport>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(shiftReportService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ShiftReport>> create(@Valid @RequestBody ShiftReport report) {
        ShiftReport created = shiftReportService.create(report);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Shift report created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ShiftReport>> update(
            @PathVariable Long id, @Valid @RequestBody ShiftReport report) {
        return ResponseEntity.ok(ApiResponse.ok(shiftReportService.update(id, report)));
    }

    @PutMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<ShiftReport>> submit(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String submittedBy = body.getOrDefault("submittedBy", "system");
        return ResponseEntity.ok(ApiResponse.ok(
                shiftReportService.submit(id, submittedBy), "Report submitted"));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<ShiftReport>> approve(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(
                shiftReportService.approve(id), "Report approved"));
    }
}