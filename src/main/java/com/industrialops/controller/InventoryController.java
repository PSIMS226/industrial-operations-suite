package com.industrialops.controller;

import com.industrialops.dto.ApiResponse;
import com.industrialops.model.InventoryItem;
import com.industrialops.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryItem>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryItem>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.findById(id)));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<InventoryItem>>> getLowStock() {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.findLowStock()));
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<ApiResponse<List<InventoryItem>>> getOutOfStock() {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.findOutOfStock()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InventoryItem>> create(@Valid @RequestBody InventoryItem item) {
        InventoryItem created = inventoryService.create(item);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Inventory item created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryItem>> update(
            @PathVariable Long id, @Valid @RequestBody InventoryItem item) {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.update(id, item)));
    }

    @PatchMapping("/{id}/adjust")
    public ResponseEntity<ApiResponse<InventoryItem>> adjustQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {

        int delta = ((Number) body.get("delta")).intValue();
        String reason = (String) body.getOrDefault("reason", "");
        return ResponseEntity.ok(ApiResponse.ok(
                inventoryService.adjustQuantity(id, delta, reason),
                "Quantity adjusted by " + delta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        inventoryService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Item deactivated"));
    }
}