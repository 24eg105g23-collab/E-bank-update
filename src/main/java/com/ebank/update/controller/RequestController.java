package com.ebank.update.controller;

import com.ebank.update.dto.ApiResponse;
import com.ebank.update.entity.UpdateRequest;
import com.ebank.update.service.BankService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final BankService bankService;

    public RequestController(BankService bankService) {
        this.bankService = bankService;
    }

    // Submit update request (supports multipart for file upload)
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<UpdateRequest>> submitRequestWithFile(
            @RequestParam("updateType") String updateType,
            @RequestParam(value = "oldValue", required = false) String oldValue,
            @RequestParam(value = "newValue", required = false) String newValue,
            @RequestParam(value = "remarks", required = false) String remarks,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestHeader(value = "X-Username", required = false, defaultValue = "customer01") String username) {
        try {
            UpdateRequest req = bankService.submitRequest(username, updateType, oldValue, newValue, remarks, file);
            return ResponseEntity.ok(ApiResponse.ok("Update request submitted successfully", req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Get current customer requests
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<UpdateRequest>>> getMyRequests(
            @RequestHeader(value = "X-Username", required = false, defaultValue = "customer01") String username,
            @RequestParam(value = "username", required = false) String queryUser) {
        String effectiveUser = (queryUser != null && !queryUser.isBlank()) ? queryUser : username;
        try {
            List<UpdateRequest> list = bankService.getCustomerRequests(effectiveUser);
            return ResponseEntity.ok(ApiResponse.ok(list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Get specific request details
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UpdateRequest>> getRequestById(@PathVariable Long id) {
        try {
            UpdateRequest req = bankService.getRequestById(id);
            return ResponseEntity.ok(ApiResponse.ok(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
