package com.ebank.update.service;

import com.ebank.update.dto.*;
import com.ebank.update.entity.*;
import com.ebank.update.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BankService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final UpdateRequestRepository updateRequestRepository;
    private final RequestHistoryRepository requestHistoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    public BankService(UserRepository userRepository,
                       CustomerRepository customerRepository,
                       UpdateRequestRepository updateRequestRepository,
                       RequestHistoryRepository requestHistoryRepository,
                       PasswordEncoder passwordEncoder,
                       FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.updateRequestRepository = updateRequestRepository;
        this.requestHistoryRepository = requestHistoryRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
    }

    // 1. Customer Registration
    @Transactional
    public Customer registerCustomer(RegisterRequest req) {
        if (req.getUsername() != null && userRepository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (req.getCustomerId() != null && customerRepository.existsByCustomerId(req.getCustomerId())) {
            throw new RuntimeException("Customer ID is already registered");
        }
        if (req.getEmail() != null && customerRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        // Default username to customerId if not provided separately
        String username = (req.getCustomerId() != null && !req.getCustomerId().isBlank())
                ? req.getCustomerId().toLowerCase()
                : req.getEmail().split("@")[0];

        if (userRepository.existsByUsername(username)) {
            username = username + "_" + System.currentTimeMillis() % 1000;
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("ROLE_CUSTOMER");
        user = userRepository.save(user);

        Customer customer = new Customer();
        customer.setUser(user);
        customer.setCustomerId(req.getCustomerId() != null ? req.getCustomerId() : "CUST-" + (10000 + customer.getId()));
        customer.setFullName(req.getFullName());
        customer.setEmail(req.getEmail());
        customer.setMobile(req.getMobile());
        customer.setAddress(req.getAddress());
        customer.setAccountNumber("1002" + (int)(Math.random() * 900000 + 100000));
        customer.setAccountType("Savings Account");
        customer.setBranchName("Metropolitan Central Branch");
        customer.setKycStatus("VERIFIED");
        customer.setPhoto("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250");
        customer.setSignature("https://upload.wikimedia.org/wikipedia/commons/f/fa/John_Hancock_Signature.svg");

        return customerRepository.save(customer);
    }

    // 2. Authentication Login
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials or user not found"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String expectedRole = (req.getRole() != null && req.getRole().equalsIgnoreCase("employee"))
                ? "ROLE_EMPLOYEE" : "ROLE_CUSTOMER";

        if (!user.getRole().equalsIgnoreCase(expectedRole)) {
            throw new RuntimeException("Selected role does not match user account privileges");
        }

        // Simple auth token for demo
        String token = "ebank-token-" + user.getId() + "-" + System.currentTimeMillis();

        Customer customer = null;
        if ("ROLE_CUSTOMER".equals(user.getRole())) {
            customer = customerRepository.findByUser(user).orElse(null);
        }

        return new AuthResponse(token, user.getUsername(), user.getRole(), customer);
    }

    // 3. Customer Profile
    public Customer getCustomerProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer user not found: " + username));
        return customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Customer profile record not found"));
    }

    @Transactional
    public Customer updateCustomerProfile(String username, Customer updatedData) {
        Customer customer = getCustomerProfile(username);
        if (updatedData.getMobile() != null) customer.setMobile(updatedData.getMobile());
        if (updatedData.getEmail() != null) customer.setEmail(updatedData.getEmail());
        if (updatedData.getAddress() != null) customer.setAddress(updatedData.getAddress());
        return customerRepository.save(customer);
    }

    // 4. Submit Update Request
    @Transactional
    public UpdateRequest submitRequest(String username, String updateType, String oldValue, String newValue, String remarks, MultipartFile file) {
        Customer customer = getCustomerProfile(username);

        String docPath = null;
        if (file != null && !file.isEmpty()) {
            docPath = fileStorageService.storeFile(file);
        }

        UpdateRequest request = new UpdateRequest();
        request.setCustomer(customer);
        request.setUpdateType(updateType.toUpperCase());
        request.setOldValue(oldValue);
        request.setNewValue(newValue);
        request.setDocumentPath(docPath);
        request.setStatus("PENDING");
        request.setRemarks(remarks);

        request = updateRequestRepository.save(request);

        // Record History
        RequestHistory history = new RequestHistory(request, "PENDING", "Request submitted by customer for " + updateType, customer.getCustomerId());
        requestHistoryRepository.save(history);

        return request;
    }

    // 5. Get Customer Requests
    public List<UpdateRequest> getCustomerRequests(String username) {
        Customer customer = getCustomerProfile(username);
        return updateRequestRepository.findByCustomerOrderByCreatedAtDesc(customer);
    }

    // 6. Get Single Request Details
    public UpdateRequest getRequestById(Long id) {
        return updateRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Update request not found with ID: " + id));
    }

    // 7. Employee/Admin All Requests
    public List<UpdateRequest> getAllRequests(String status) {
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            return updateRequestRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
        }
        return updateRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    // 8. Employee Review: Approve
    @Transactional
    public UpdateRequest approveRequest(Long id, String employeeUsername, String remarks) {
        UpdateRequest request = getRequestById(id);
        request.setStatus("APPROVED");
        request.setReviewedBy(employeeUsername != null ? employeeUsername : "admin01");
        request.setReviewedAt(LocalDateTime.now());
        request.setRemarks(remarks != null ? remarks : "Approved by officer");

        // Automatically sync customer master record based on update type
        Customer customer = request.getCustomer();
        String type = request.getUpdateType().toUpperCase();

        if (type.contains("SIGNATURE")) {
            if (request.getDocumentPath() != null) {
                customer.setSignature(request.getDocumentPath());
            } else if (request.getNewValue() != null) {
                customer.setSignature(request.getNewValue());
            }
        } else if (type.contains("PHOTO")) {
            if (request.getDocumentPath() != null) {
                customer.setPhoto(request.getDocumentPath());
            } else if (request.getNewValue() != null) {
                customer.setPhoto(request.getNewValue());
            }
        } else if (type.contains("MOBILE")) {
            if (request.getNewValue() != null) customer.setMobile(request.getNewValue());
        } else if (type.contains("EMAIL")) {
            if (request.getNewValue() != null) customer.setEmail(request.getNewValue());
        } else if (type.contains("ADDRESS")) {
            if (request.getNewValue() != null) customer.setAddress(request.getNewValue());
        } else if (type.contains("KYC")) {
            customer.setKycStatus("VERIFIED");
        }
        customerRepository.save(customer);

        request = updateRequestRepository.save(request);

        // Record in history
        RequestHistory history = new RequestHistory(request, "APPROVED", remarks != null ? remarks : "Approved", request.getReviewedBy());
        requestHistoryRepository.save(history);

        return request;
    }

    // 9. Employee Review: Reject
    @Transactional
    public UpdateRequest rejectRequest(Long id, String employeeUsername, String remarks) {
        UpdateRequest request = getRequestById(id);
        request.setStatus("REJECTED");
        request.setReviewedBy(employeeUsername != null ? employeeUsername : "admin01");
        request.setReviewedAt(LocalDateTime.now());
        request.setRemarks(remarks != null ? remarks : "Document verification failed. Please resubmit valid proof.");

        request = updateRequestRepository.save(request);

        RequestHistory history = new RequestHistory(request, "REJECTED", request.getRemarks(), request.getReviewedBy());
        requestHistoryRepository.save(history);

        return request;
    }

    // 10. Admin Dashboard Metrics
    public AdminDashboardDto getAdminDashboard() {
        long totalCustomers = customerRepository.count();
        long pending = updateRequestRepository.countByStatus("PENDING");
        long approved = updateRequestRepository.countByStatus("APPROVED");
        long rejected = updateRequestRepository.countByStatus("REJECTED");
        List<UpdateRequest> recent = updateRequestRepository.findAllByOrderByCreatedAtDesc();
        if (recent.size() > 5) {
            recent = recent.subList(0, 5);
        }
        return new AdminDashboardDto(totalCustomers, pending, approved, rejected, recent);
    }

    // 11. Request Audit History
    public List<RequestHistory> getRequestHistory(Long requestId) {
        UpdateRequest req = getRequestById(requestId);
        return requestHistoryRepository.findByRequestOrderByChangedAtDesc(req);
    }
}
