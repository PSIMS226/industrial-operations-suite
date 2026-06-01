package com.industrialops.service;

import com.industrialops.model.InventoryItem;
import com.industrialops.repository.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryService {

    private final InventoryItemRepository inventoryRepository;
    private final AlertService alertService;

    public List<InventoryItem> findAll() {
        return inventoryRepository.findByActiveTrue();
    }

    public InventoryItem findById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found: " + id));
    }

    public List<InventoryItem> findLowStock() {
        return inventoryRepository.findLowStockItems();
    }

    public List<InventoryItem> findOutOfStock() {
        return inventoryRepository.findOutOfStockItems();
    }

    @Transactional
    public InventoryItem create(InventoryItem item) {
        if (inventoryRepository.existsBySku(item.getSku())) {
            throw new RuntimeException("SKU already exists: " + item.getSku());
        }
        return inventoryRepository.save(item);
    }

    @Transactional
    public InventoryItem update(Long id, InventoryItem updated) {
        InventoryItem existing = findById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setCategory(updated.getCategory());
        existing.setUnitOfMeasure(updated.getUnitOfMeasure());
        existing.setReorderPoint(updated.getReorderPoint());
        existing.setReorderQuantity(updated.getReorderQuantity());
        existing.setUnitCost(updated.getUnitCost());
        existing.setSupplier(updated.getSupplier());
        existing.setStorageLocation(updated.getStorageLocation());
        return inventoryRepository.save(existing);
    }

    @Transactional
    public InventoryItem adjustQuantity(Long id, int delta, String reason) {
        InventoryItem item = findById(id);
        int newQty = item.getQuantityOnHand() + delta;
        if (newQty < 0) {
            throw new RuntimeException("Insufficient stock. Available: " + item.getQuantityOnHand());
        }
        item.setQuantityOnHand(newQty);
        InventoryItem saved = inventoryRepository.save(item);

        if (saved.isLowStock()) {
            alertService.createLowInventoryAlert(saved);
        }

        return saved;
    }

    @Transactional
    public void deactivate(Long id) {
        InventoryItem item = findById(id);
        item.setActive(false);
        inventoryRepository.save(item);
    }
}