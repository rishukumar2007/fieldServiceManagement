package com.KEYSTONE.fieldServiceManagement.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Part {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private Double unitCost;

    @Column(nullable = false)
    private Integer stockQty;
}
