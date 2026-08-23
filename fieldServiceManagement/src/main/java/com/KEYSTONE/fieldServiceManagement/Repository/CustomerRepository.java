package com.KEYSTONE.fieldServiceManagement.Repository;

import com.KEYSTONE.fieldServiceManagement.Entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
