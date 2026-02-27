package com.procurement.procurement.controller.procurement;

import com.procurement.procurement.entity.procurement.Requisition;
import com.procurement.procurement.service.procurement.RequisitionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/procurement/requisition")
public class RequisitionController {

    private final RequisitionService requisitionService;

    public RequisitionController(RequisitionService requisitionService) {
        this.requisitionService = requisitionService;  // ← use SERVICE not repository directly
    }

    @PostMapping("/create")
    public ResponseEntity<Requisition> createRequisition(@RequestBody Requisition requisition) {
        return ResponseEntity.ok(requisitionService.createRequisition(requisition));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Requisition>> getAllRequisitions() {
        return ResponseEntity.ok(requisitionService.getAllRequisitions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequisitionById(@PathVariable Long id) {
        try {
            // you can add a getById method in service, for now using getAllRequisitions filter
            List<Requisition> all = requisitionService.getAllRequisitions();
            return all.stream()
                    .filter(r -> r.getId().equals(id))
                    .findFirst()
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElse(ResponseEntity.badRequest().body("Requisition not found"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/update-status/{id}")
    public ResponseEntity<String> updateRequisitionStatus(@PathVariable Long id,
                                                          @RequestParam String status) {
        try {
            requisitionService.updateRequisition(id, buildStatusUpdate(status));
            return ResponseEntity.ok("Requisition status updated to " + status);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // ===================== DEBUG - remove after fixing =====================
    @GetMapping("/debug-roles")
    public ResponseEntity<String> debugRoles() {
        org.springframework.security.core.Authentication auth =
                org.springframework.security.core.context.SecurityContextHolder
                        .getContext().getAuthentication();

        String result = "User: " + auth.getName() +
                " | Authorities: " + auth.getAuthorities().toString();

        return ResponseEntity.ok(result);
    }

    // helper to build a minimal update object just for status change
    private Requisition buildStatusUpdate(String status) {
        Requisition r = new Requisition();
        r.setStatus(status);
        return r;
    }
}