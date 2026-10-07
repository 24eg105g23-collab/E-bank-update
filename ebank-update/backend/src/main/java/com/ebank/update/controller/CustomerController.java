package com.ebank.update.controller;

import com.ebank.update.dto.ApiResponse;
import com.ebank.update.entity.Customer;
import com.ebank.update.service.BankService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final BankService bankService;

    public CustomerController(BankService bankService) {
        this.bankService = bankService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Customer>> getProfile(
            @RequestParam(value = "username", required = false, defaultValue = "customer01") String username,
            @RequestHeader(value = "X-Username", required = false) String headerUser) {
        String effectiveUser = (headerUser != null && !headerUser.isBlank()) ? headerUser : username;
        try {
            Customer profile = bankService.getCustomerProfile(effectiveUser);
            return ResponseEntity.ok(ApiResponse.ok(profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Customer>> updateProfile(
            @RequestBody Customer updatedData,
            @RequestHeader(value = "X-Username", required = false, defaultValue = "customer01") String username) {
        try {
            Customer profile = bankService.updateCustomerProfile(username, updatedData);
            return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
