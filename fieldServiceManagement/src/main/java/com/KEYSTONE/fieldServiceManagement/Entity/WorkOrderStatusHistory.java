package com.KEYSTONE.fieldServiceManagement.Entity;
import com.KEYSTONE.fieldServiceManagement.Enum.WorkOrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private WorkOrder workOrder;

    @Enumerated(EnumType.STRING)
    private WorkOrderStatus fromStatus;

    @Enumerated(EnumType.STRING)
    private WorkOrderStatus toStatus;

    @ManyToOne
    private User changedBy;

    private LocalDateTime changedAt;

    private String note;
}
