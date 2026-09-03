package com.KEYSTONE.fieldServiceManagement.service;

import com.KEYSTONE.fieldServiceManagement.dto.CreateCustomerRequest;
import com.KEYSTONE.fieldServiceManagement.dto.CustomerDto;
import com.KEYSTONE.fieldServiceManagement.dto.SiteDto;
import com.KEYSTONE.fieldServiceManagement.exception.ResourceNotFoundException;
import com.KEYSTONE.fieldServiceManagement.model.Customer;
import com.KEYSTONE.fieldServiceManagement.repository.CustomerRepository;
import com.KEYSTONE.fieldServiceManagement.repository.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository, SiteRepository siteRepository) {
        this.customerRepository = customerRepository;
        this.siteRepository = siteRepository;
    }

    @Transactional(readOnly = true)
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(CustomerDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomerDto getCustomerById(String id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        return CustomerDto.fromEntity(customer);
    }

    @Transactional
    public CustomerDto createCustomer(CreateCustomerRequest request) {
        String id = "cust-" + UUID.randomUUID().toString().substring(0, 8);
        Customer customer = Customer.builder()
                .id(id)
                .name(request.getName())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .build();

        Customer saved = customerRepository.save(customer);
        return CustomerDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<SiteDto> getSitesByCustomerId(String customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer not found with ID: " + customerId);
        }
        return siteRepository.findByCustomerId(customerId).stream()
                .map(SiteDto::fromEntity)
                .collect(Collectors.toList());
    }
}
