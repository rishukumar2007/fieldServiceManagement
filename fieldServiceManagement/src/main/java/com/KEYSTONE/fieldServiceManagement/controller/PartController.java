package com.KEYSTONE.fieldServiceManagement.controller;

import com.KEYSTONE.fieldServiceManagement.dto.CreatePartRequest;
import com.KEYSTONE.fieldServiceManagement.dto.PartDto;
import com.KEYSTONE.fieldServiceManagement.service.PartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/parts", "/parts"})
@CrossOrigin(origins = "*")
public class PartController {

    private final PartService partService;

    @Autowired
    public PartController(PartService partService) {
        this.partService = partService;
    }

    @GetMapping
    public ResponseEntity<List<PartDto>> getAllParts() {
        List<PartDto> parts = partService.getAllParts();
        return ResponseEntity.ok(parts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartDto> getPartById(@PathVariable String id) {
        PartDto part = partService.getPartById(id);
        return ResponseEntity.ok(part);
    }

    @PostMapping
    public ResponseEntity<PartDto> createPart(@Valid @RequestBody CreatePartRequest request) {
        PartDto created = partService.createPart(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PartDto> updatePart(@PathVariable String id, @Valid @RequestBody CreatePartRequest request) {
        PartDto updated = partService.updatePart(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<PartDto>> getLowStockParts(@RequestParam(defaultValue = "10") int threshold) {
        List<PartDto> lowStock = partService.getLowStockParts(threshold);
        return ResponseEntity.ok(lowStock);
    }
}
