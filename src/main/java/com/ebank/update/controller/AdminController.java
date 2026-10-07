package com.ebank.update.controller;

import com.ebank.update.dto.AdminDashboardDto;
import com.ebank.update.dto.ApiResponse;
import com.ebank.update.dto.ReviewRequestDto;
import com.ebank.update.entity.RequestHistory;
import com.ebank.update.entity.UpdateRequest;
import com.ebank.update.service.BankService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final BankService bankService;

    public AdminController(BankService bankService) {
        this.bankService = bankService;
    }

    // Admin Dashboard stats
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboardStats() {
        try {
            AdminDashboardDto stats = bankService.getAdminDashboard();
            return ResponseEntity.ok(ApiResponse.ok(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Get all requests with optional status filter
    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<UpdateRequest>>> getAllRequests(
            @RequestParam(value = "status", required = false) String status) {
        try {
            List<UpdateRequest> requests = bankService.getAllRequests(status);
            return ResponseEntity.ok(ApiResponse.ok(requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Get request details by ID
    @GetMapping("/requests/{id}")
    public ResponseEntity<ApiResponse<UpdateRequest>> getRequestById(@PathVariable Long id) {
        try {
            UpdateRequest req = bankService.getRequestById(id);
            return ResponseEntity.ok(ApiResponse.ok(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Approve update request
    @PutMapping("/requests/{id}/approve")
    public ResponseEntity<ApiResponse<UpdateRequest>> approveRequest(
            @PathVariable Long id,
            @RequestBody(required = false) ReviewRequestDto reviewDto,
            @RequestHeader(value = "X-Username", required = false, defaultValue = "admin01") String officerUsername) {
        try {
            String remarks = (reviewDto != null && reviewDto.getRemarks() != null) ? reviewDto.getRemarks() : "Documents validated and approved.";
            UpdateRequest req = bankService.approveRequest(id, officerUsername, remarks);
            return ResponseEntity.ok(ApiResponse.ok("Request approved and customer records synchronized successfully", req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Reject update request
    @PutMapping("/requests/{id}/reject")
    public ResponseEntity<ApiResponse<UpdateRequest>> rejectRequest(
            @PathVariable Long id,
            @RequestBody(required = false) ReviewRequestDto reviewDto,
            @RequestHeader(value = "X-Username", required = false, defaultValue = "admin01") String officerUsername) {
        try {
            String remarks = (reviewDto != null && reviewDto.getRemarks() != null) ? reviewDto.getRemarks() : "Verification requirements not met.";
            UpdateRequest req = bankService.rejectRequest(id, officerUsername, remarks);
            return ResponseEntity.ok(ApiResponse.ok("Request rejected with remarks recorded", req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Get audit history of a request
    @GetMapping("/requests/{id}/history")
    public ResponseEntity<ApiResponse<List<RequestHistory>>> getRequestHistory(@PathVariable Long id) {
        try {
            List<RequestHistory> history = bankService.getRequestHistory(id);
            return ResponseEntity.ok(ApiResponse.ok(history));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
