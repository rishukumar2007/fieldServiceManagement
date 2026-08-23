package com.KEYSTONE.fieldServiceManagement.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "part_usages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id", nullable = false)
    private Part part;

    @Column(nullable = false)
    private String partName;

    @Column(nullable = false)
    private Double unitCost;

    @Column(nullable = false)
    private Integer qtyUsed;

    @Column(nullable = false)
    private Double totalCost;
}
