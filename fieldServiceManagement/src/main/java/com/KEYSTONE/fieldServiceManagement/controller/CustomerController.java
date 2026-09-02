package com.KEYSTONE.fieldServiceManagement.controller;

import com.KEYSTONE.fieldServiceManagement.dto.CreateCustomerRequest;
import com.KEYSTONE.fieldServiceManagement.dto.CreateSiteRequest;
import com.KEYSTONE.fieldServiceManagement.dto.CustomerDto;
import com.KEYSTONE.fieldServiceManagement.dto.SiteDto;
import com.KEYSTONE.fieldServiceManagement.service.CustomerService;
import com.KEYSTONE.fieldServiceManagement.service.SiteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/customers", "/customers"})
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService customerService;
    private final SiteService siteService;

    @Autowired
    public CustomerController(CustomerService customerService, SiteService siteService) {
        this.customerService = customerService;
        this.siteService = siteService;
    }

    @GetMapping
    public ResponseEntity<List<CustomerDto>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable String id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PostMapping
    public ResponseEntity<CustomerDto> createCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        CustomerDto created = customerService.createCustomer(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{customerId}/sites")
    public ResponseEntity<List<SiteDto>> getSitesByCustomer(@PathVariable String customerId) {
        return ResponseEntity.ok(customerService.getSitesByCustomerId(customerId));
    }

    @PostMapping("/{customerId}/sites")
    public ResponseEntity<SiteDto> createSiteForCustomer(@PathVariable String customerId, @Valid @RequestBody CreateSiteRequest request) {
        request.setCustomerId(customerId);
        SiteDto created = siteService.createSite(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
