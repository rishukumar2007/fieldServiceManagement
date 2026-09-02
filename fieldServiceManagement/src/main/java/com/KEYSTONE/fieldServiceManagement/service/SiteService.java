package com.KEYSTONE.fieldServiceManagement.service;

import com.KEYSTONE.fieldServiceManagement.dto.CreateSiteRequest;
import com.KEYSTONE.fieldServiceManagement.dto.SiteDto;
import com.KEYSTONE.fieldServiceManagement.exception.ResourceNotFoundException;
import com.KEYSTONE.fieldServiceManagement.model.Customer;
import com.KEYSTONE.fieldServiceManagement.model.Site;
import com.KEYSTONE.fieldServiceManagement.repository.CustomerRepository;
import com.KEYSTONE.fieldServiceManagement.repository.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SiteService {

    private final SiteRepository siteRepository;
    private final CustomerRepository customerRepository;

    @Autowired
    public SiteService(SiteRepository siteRepository, CustomerRepository customerRepository) {
        this.siteRepository = siteRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public List<SiteDto> getAllSites() {
        return siteRepository.findAll().stream()
                .map(SiteDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SiteDto getSiteById(String id) {
        Site site = siteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Site not found with ID: " + id));
        return SiteDto.fromEntity(site);
    }

    @Transactional
    public SiteDto createSite(CreateSiteRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));

        String id = "site-" + UUID.randomUUID().toString().substring(0, 8);
        Site site = Site.builder()
                .id(id)
                .customer(customer)
                .name(request.getName())
                .address(request.getAddress())
                .build();

        Site saved = siteRepository.save(site);
        return SiteDto.fromEntity(saved);
    }
}
