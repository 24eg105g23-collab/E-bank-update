package com.ebank.update.config;

import com.ebank.update.entity.Customer;
import com.ebank.update.entity.User;
import com.ebank.update.repository.CustomerRepository;
import com.ebank.update.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository,
                                      CustomerRepository customerRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Seed Employee / Admin account
            if (!userRepository.existsByUsername("admin01")) {
                User admin = new User();
                admin.setUsername("admin01");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole("ROLE_EMPLOYEE");
                userRepository.save(admin);
                System.out.println(">>> Demo Employee Account Initialized: admin01 / Admin@123");
            }

            // 2. Seed Demo Customer account
            if (!userRepository.existsByUsername("customer01")) {
                User customerUser = new User();
                customerUser.setUsername("customer01");
                customerUser.setPassword(passwordEncoder.encode("Customer@123"));
                customerUser.setRole("ROLE_CUSTOMER");
                customerUser = userRepository.save(customerUser);

                Customer customer = new Customer();
                customer.setUser(customerUser);
                customer.setCustomerId("CUST-10492");
                customer.setFullName("Aarav Sharma");
                customer.setEmail("aarav.sharma@example.com");
                customer.setMobile("+91 98765 43210");
                customer.setAddress("42, Galaxy Residency, MG Road, Bangalore 560001");
                customer.setAccountNumber("100284759231");
                customer.setAccountType("Savings Platinum");
                customer.setBranchName("MG Road Metropolis Branch");
                customer.setKycStatus("VERIFIED");
                customer.setPhoto("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250");
                customer.setSignature("https://upload.wikimedia.org/wikipedia/commons/f/fa/John_Hancock_Signature.svg");
                customerRepository.save(customer);

                System.out.println(">>> Demo Customer Account Initialized: customer01 / Customer@123 (Aarav Sharma)");
            }
        };
    }
}
