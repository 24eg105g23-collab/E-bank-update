package com.ebank.update.repository;

import com.ebank.update.entity.Customer;
import com.ebank.update.entity.UpdateRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UpdateRequestRepository extends JpaRepository<UpdateRequest, Long> {
    List<UpdateRequest> findByCustomerOrderByCreatedAtDesc(Customer customer);
    List<UpdateRequest> findAllByOrderByCreatedAtDesc();
    List<UpdateRequest> findByStatusOrderByCreatedAtDesc(String status);
    long countByStatus(String status);
}
