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
public class Part {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String partName;

    private Integer stock;

    private Double price;

    @OneToMany(mappedBy = "part")
    private List<PartUsage> usages;
}
