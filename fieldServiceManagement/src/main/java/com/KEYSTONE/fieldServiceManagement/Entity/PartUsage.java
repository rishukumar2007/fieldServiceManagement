package com.KEYSTONE.fieldServiceManagement.Entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private WorkOrder workOrder;

    @ManyToOne
    private Part part;

    private Integer quantity;
}