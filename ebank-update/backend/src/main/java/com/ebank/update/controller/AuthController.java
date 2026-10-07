package com.ebank.update.controller;

import com.ebank.update.dto.*;
import com.ebank.update.entity.Customer;
import com.ebank.update.service.BankService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final BankService bankService;

    public AuthController(BankService bankService) {
        this.bankService = bankService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Customer>> register(@RequestBody RegisterRequest request) {
        try {
            Customer customer = bankService.registerCustomer(request);
            return ResponseEntity.ok(ApiResponse.ok("Customer registered successfully!", customer));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = bankService.login(request);
            return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
