package com.KEYSTONE.fieldServiceManagement.service;

import com.KEYSTONE.fieldServiceManagement.dto.CreatePartRequest;
import com.KEYSTONE.fieldServiceManagement.dto.PartDto;
import com.KEYSTONE.fieldServiceManagement.exception.ResourceNotFoundException;
import com.KEYSTONE.fieldServiceManagement.model.Part;
import com.KEYSTONE.fieldServiceManagement.repository.PartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PartService {

    private final PartRepository partRepository;

    @Autowired
    public PartService(PartRepository partRepository) {
        this.partRepository = partRepository;
    }

    @Transactional(readOnly = true)
    public List<PartDto> getAllParts() {
        return partRepository.findAll().stream()
                .map(PartDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PartDto getPartById(String id) {
        Part part = partRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with ID: " + id));
        return PartDto.fromEntity(part);
    }

    @Transactional
    public PartDto createPart(CreatePartRequest request) {
        if (partRepository.findBySkuIgnoreCase(request.getSku()).isPresent()) {
            throw new IllegalArgumentException("Part with SKU " + request.getSku() + " already exists");
        }

        String id = "part-" + UUID.randomUUID().toString().substring(0, 8);
        Part part = Part.builder()
                .id(id)
                .name(request.getName())
                .sku(request.getSku().toUpperCase().trim())
                .unitCost(request.getUnitCost())
                .stockQty(request.getStockQty())
                .build();

        Part saved = partRepository.save(part);
        return PartDto.fromEntity(saved);
    }

    @Transactional
    public PartDto updatePart(String id, CreatePartRequest request) {
        Part part = partRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with ID: " + id));

        part.setName(request.getName());
        part.setSku(request.getSku().toUpperCase().trim());
        part.setUnitCost(request.getUnitCost());
        part.setStockQty(request.getStockQty());

        Part saved = partRepository.save(part);
        return PartDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<PartDto> getLowStockParts(int threshold) {
        return partRepository.findByStockQtyLessThan(threshold).stream()
                .map(PartDto::fromEntity)
                .collect(Collectors.toList());
    }
}
