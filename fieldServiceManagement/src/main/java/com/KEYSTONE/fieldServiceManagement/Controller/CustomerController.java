package com.KEYSTONE.fieldServiceManagement.Controller;

import com.KEYSTONE.fieldServiceManagement.Entity.Customer;
import com.KEYSTONE.fieldServiceManagement.Entity.Site;
import com.KEYSTONE.fieldServiceManagement.Repository.CustomerRepository;
import com.KEYSTONE.fieldServiceManagement.Repository.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SiteRepository siteRepository;

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(customerRepository.save(customer));
    }

    @GetMapping("/{customerId}/sites")
    public ResponseEntity<List<Site>> getSitesByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(siteRepository.findByCustomerId(customerId));
    }

    @PostMapping("/{customerId}/sites")
    public ResponseEntity<Site> createSite(@PathVariable Long customerId, @RequestBody Site site) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        site.setCustomer(customer);
        return ResponseEntity.ok(siteRepository.save(site));
    }
}
