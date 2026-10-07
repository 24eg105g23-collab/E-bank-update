package com.ebank.update.repository;

import com.ebank.update.entity.Customer;
import com.ebank.update.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUser(User user);
    Optional<Customer> findByCustomerId(String customerId);
    Optional<Customer> findByEmail(String email);
    boolean existsByCustomerId(String customerId);
    boolean existsByEmail(String email);
}
