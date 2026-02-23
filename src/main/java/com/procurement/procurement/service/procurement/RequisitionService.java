package com.procurement.procurement.service.procurement;

import com.procurement.procurement.entity.procurement.Requisition;
import com.procurement.procurement.entity.user.User;
import com.procurement.procurement.repository.procurement.RequisitionRepository;
import com.procurement.procurement.repository.user.UserRepository;
import com.procurement.procurement.service.audit.AuditService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional // ✅ Added for safe DB operations
public class RequisitionService {

    private final RequisitionRepository requisitionRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public RequisitionService(RequisitionRepository requisitionRepository,
                              UserRepository userRepository,
                              AuditService auditService) {
        this.requisitionRepository = requisitionRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    // ===================== CREATE =====================
    @PreAuthorize("hasAuthority('CREATE_REQUISITION')")
    public Requisition createRequisition(Requisition requisition) {

        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        requisition.setRequestedBy(currentUser);
        requisition.setStatus("PENDING"); // Force initial status
        requisition.setCreatedAt(LocalDateTime.now());
        requisition.setUpdatedAt(LocalDateTime.now());

        // 🔥 FIX: Loop to link items back to the parent Requisition
        if (requisition.getItems() != null) {
            requisition.getItems().forEach(item -> item.setRequisition(requisition));
        }

        Requisition saved = requisitionRepository.save(requisition);

        auditService.log("Requisition", saved.getId(), "CREATE", "Requisition created successfully");

        return saved;
    }

    // ===================== UPDATE =====================
    @PreAuthorize("hasAuthority('UPDATE_REQUISITION')")
    public Requisition updateRequisition(Long id, Requisition updatedReq) {

        Requisition existingReq = requisitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Requisition not found with id: " + id));

        existingReq.setRequisitionNumber(updatedReq.getRequisitionNumber());
        existingReq.setStatus(updatedReq.getStatus());
        existingReq.setUpdatedAt(LocalDateTime.now());

        // 🔥 FIX: Clear and re-add items using the helper method for proper linking
        if (updatedReq.getItems() != null) {
            existingReq.setItems(updatedReq.getItems());
        }

        Requisition saved = requisitionRepository.save(existingReq);

        auditService.log("Requisition", saved.getId(), "UPDATE", "Requisition updated successfully");

        return saved;
    }

    @PreAuthorize("hasAnyRole('ADMIN','PROCUREMENT_MANAGER')")
    public List<Requisition> getAllRequisitions() {
        return requisitionRepository.findAll();
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<Requisition> getMyRequisitions() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return requisitionRepository.findByRequestedBy(currentUser);
    }

    @PreAuthorize("hasAuthority('VIEW_REQUISITION')")
    public List<Requisition> getRequisitionsByStatus(String status) {
        return requisitionRepository.findByStatus(status);
    }
}