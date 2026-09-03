package com.KEYSTONE.fieldServiceManagement.repository;

import com.KEYSTONE.fieldServiceManagement.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    Optional<Customer> findByName(String name);
}
