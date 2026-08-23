package com.KEYSTONE.fieldServiceManagement.Config;

import com.KEYSTONE.fieldServiceManagement.Entity.*;
import com.KEYSTONE.fieldServiceManagement.Enum.Priority;
import com.KEYSTONE.fieldServiceManagement.Enum.Role;
import com.KEYSTONE.fieldServiceManagement.Enum.WorkOrderStatus;
import com.KEYSTONE.fieldServiceManagement.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SiteRepository siteRepository;

    @Autowired
    private PartRepository partRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) return; // Already seeded

        // 1. Seed Users (PDF Section 15 & 03)
        User dispatcher = userRepository.save(User.builder()
                .name("Sarah Vance")
                .email("sarah.v@meridian.com")
                .passwordHash("password123")
                .role(Role.DISPATCHER)
                .build());

        User tech = userRepository.save(User.builder()
                .name("Mike Smith")
                .email("mike.smith@meridian.com")
                .passwordHash("password123")
                .role(Role.TECHNICIAN)
                .build());

        User manager = userRepository.save(User.builder()
                .name("John Miller")
                .email("john.m@meridian.com")
                .passwordHash("password123")
                .role(Role.MANAGER)
                .build());

        User customerUser = userRepository.save(User.builder()
                .name("Alice Cooper")
                .email("alice@acmecorp.com")
                .passwordHash("password123")
                .role(Role.CUSTOMER)
                .build());

        // 2. Seed Customers & Sites
        Customer acme = customerRepository.save(Customer.builder()
                .name("Acme Corporation")
                .contactEmail("contact@acmecorp.com")
                .contactPhone("+1 555-0199")
                .build());

        Site acmeHQ = siteRepository.save(Site.builder()
                .name("Acme HQ - Server Room")
                .address("100 Industrial Parkway, Austin TX")
                .customer(acme)
                .build());

        // 3. Seed Inventory Parts
        partRepository.saveAll(Arrays.asList(
                Part.builder().name("HDU-900 Filter Cartridge").sku("PRT-HDU900").unitCost(145.00).stockQty(12).build(),
                Part.builder().name("2.5in Heavy-Duty Pressure Valve").sku("PRT-VALVE25").unitCost(210.00).stockQty(8).build(),
                Part.builder().name("Copper Gasket Set (Pack of 5)").sku("PRT-GSKT-5").unitCost(35.50).stockQty(25).build()
        ));

        // 4. Seed Sample Work Orders
        LocalDateTime now = LocalDateTime.now();
        workOrderRepository.save(WorkOrder.builder()
                .code("WO-1001")
                .title("HVAC Chiller Unit Overheating")
                .description("Primary compressor tripping high-temp limit switch in Main Data Hall.")
                .priority(Priority.URGENT)
                .status(WorkOrderStatus.IN_PROGRESS)
                .createdAt(now.minusHours(2))
                .slaDueAt(now.plusHours(2))
                .customer(acme)
                .site(acmeHQ)
                .assignedTo(tech)
                .partsCost(145.00)
                .laborMinutes(120)
                .build());

        workOrderRepository.save(WorkOrder.builder()
                .code("WO-1002")
                .title("Quarterly Calibration & Sensor Check")
                .description("Routine preventive maintenance for pressure transducers.")
                .priority(Priority.MEDIUM)
                .status(WorkOrderStatus.NEW)
                .createdAt(now.minusHours(5))
                .slaDueAt(now.plusHours(43))
                .customer(acme)
                .site(acmeHQ)
                .partsCost(0.0)
                .laborMinutes(0)
                .build());
    }
}
