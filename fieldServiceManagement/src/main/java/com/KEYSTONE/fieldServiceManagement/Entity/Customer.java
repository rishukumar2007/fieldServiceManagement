package com.KEYSTONE.fieldServiceManagement.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String phone;

    private String email;

    @OneToMany(mappedBy = "customer")
    private List<Site> sites;

    @OneToMany(mappedBy = "customer")
    private List<WorkOrder> workOrders;
}