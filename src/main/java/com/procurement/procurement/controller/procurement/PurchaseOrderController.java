package com.procurement.procurement.controller.procurement;

import com.procurement.procurement.entity.procurement.PurchaseOrder;
import com.procurement.procurement.repository.procurement.PurchaseOrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/procurement/purchase-order")
public class PurchaseOrderController {

    private final PurchaseOrderRepository purchaseOrderRepository;

    public PurchaseOrderController(PurchaseOrderRepository purchaseOrderRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    // ===================== Create Purchase Order =====================
    @PostMapping("/create")
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(
            @RequestBody PurchaseOrder purchaseOrder) {

        purchaseOrder.setCreatedAt(LocalDateTime.now());
        purchaseOrder.setUpdatedAt(LocalDateTime.now());

        // ✅ Properly link each item back to the parent PO
        if (purchaseOrder.getItems() != null) {
            purchaseOrder.getItems().forEach(item ->
                    item.setPurchaseOrder(purchaseOrder)
            );
        }

        PurchaseOrder saved = purchaseOrderRepository.save(purchaseOrder);
        return ResponseEntity.ok(saved);
    }

    // ===================== Get all Purchase Orders =====================
    @GetMapping("/all")
    public ResponseEntity<List<PurchaseOrder>> getAllPurchaseOrders() {
        return ResponseEntity.ok(purchaseOrderRepository.findAll());
    }

    // ===================== Get Purchase Order by ID =====================
    @GetMapping("/{id}")
    public ResponseEntity<?> getPurchaseOrderById(@PathVariable Long id) {
        Optional<PurchaseOrder> poOpt = purchaseOrderRepository.findById(id);
        if (poOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Purchase Order not found");
        }
        return ResponseEntity.ok(poOpt.get());
    }

    // ===================== Update Purchase Order Status =====================
    @PatchMapping("/update-status/{id}")
    public ResponseEntity<String> updateStatus(@PathVariable Long id,
                                               @RequestParam String status) {
        Optional<PurchaseOrder> poOpt = purchaseOrderRepository.findById(id);
        if (poOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Purchase Order not found");
        }

        PurchaseOrder po = poOpt.get();
        po.setStatus(status);
        po.setUpdatedAt(LocalDateTime.now());
        purchaseOrderRepository.save(po);

        return ResponseEntity.ok("Purchase Order status updated to " + status);
    }
}