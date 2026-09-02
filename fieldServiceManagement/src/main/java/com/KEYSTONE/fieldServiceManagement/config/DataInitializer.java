package com.KEYSTONE.fieldServiceManagement.config;

import com.KEYSTONE.fieldServiceManagement.model.*;
import com.KEYSTONE.fieldServiceManagement.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;
    private final PartRepository partRepository;
    private final WorkOrderRepository workOrderRepository;
    private final WorkOrderStatusHistoryRepository historyRepository;
    private final PartUsageRepository partUsageRepository;
    private final TimeLogRepository timeLogRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository,
                           CustomerRepository customerRepository,
                           SiteRepository siteRepository,
                           PartRepository partRepository,
                           WorkOrderRepository workOrderRepository,
                           WorkOrderStatusHistoryRepository historyRepository,
                           PartUsageRepository partUsageRepository,
                           TimeLogRepository timeLogRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.siteRepository = siteRepository;
        this.partRepository = partRepository;
        this.workOrderRepository = workOrderRepository;
        this.historyRepository = historyRepository;
        this.partUsageRepository = partUsageRepository;
        this.timeLogRepository = timeLogRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already populated. Skipping data initialization.");
            return;
        }

        logger.info("Populating database with demo seed data for KEYSTONE...");

        String defaultEncodedPassword = passwordEncoder.encode("password123");
        LocalDateTime now = LocalDateTime.now();

        // 1. Seed Users
        User manager = User.builder()
                .id("usr-1")
                .name("John Miller")
                .email("john.m@meridian.com")
                .password(defaultEncodedPassword)
                .role(Role.MANAGER)
                .avatarUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80")
                .createdAt(now.minusDays(30))
                .build();

        User dispatcher = User.builder()
                .id("usr-2")
                .name("Sarah Vance")
                .email("sarah.v@meridian.com")
                .password(defaultEncodedPassword)
                .role(Role.DISPATCHER)
                .avatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80")
                .createdAt(now.minusDays(30))
                .build();

        User tech1 = User.builder()
                .id("usr-3")
                .name("Mike Smith")
                .email("mike.smith@meridian.com")
                .password(defaultEncodedPassword)
                .role(Role.TECHNICIAN)
                .avatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80")
                .createdAt(now.minusDays(30))
                .build();

        User tech2 = User.builder()
                .id("usr-4")
                .name("Sarah Johnson")
                .email("sarah.j@meridian.com")
                .password(defaultEncodedPassword)
                .role(Role.TECHNICIAN)
                .avatarUrl("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80")
                .createdAt(now.minusDays(30))
                .build();

        User tech3 = User.builder()
                .id("usr-5")
                .name("David Brown")
                .email("david.b@meridian.com")
                .password(defaultEncodedPassword)
                .role(Role.TECHNICIAN)
                .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")
                .createdAt(now.minusDays(30))
                .build();

        User tech4 = User.builder()
                .id("usr-6")
                .name("Chris Wilson")
                .email("chris.w@meridian.com")
                .password(defaultEncodedPassword)
                .role(Role.TECHNICIAN)
                .avatarUrl("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80")
                .createdAt(now.minusDays(30))
                .build();

        User customerUser = User.builder()
                .id("usr-7")
                .name("Alice Acme")
                .email("alice@acmecorp.com")
                .password(defaultEncodedPassword)
                .role(Role.CUSTOMER)
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
                .createdAt(now.minusDays(30))
                .build();

        userRepository.save(manager);
        userRepository.save(dispatcher);
        userRepository.save(tech1);
        userRepository.save(tech2);
        userRepository.save(tech3);
        userRepository.save(tech4);
        userRepository.save(customerUser);

        // 2. Seed Customers
        Customer cust1 = Customer.builder()
                .id("cust-1")
                .name("Acme Corp")
                .contactEmail("contact@acmecorp.com")
                .contactPhone("+1 555-0192")
                .build();

        Customer cust2 = Customer.builder()
                .id("cust-2")
                .name("Global Industries")
                .contactEmail("facilities@globalind.com")
                .contactPhone("+1 555-0184")
                .build();

        Customer cust3 = Customer.builder()
                .id("cust-3")
                .name("Sunset Holdings")
                .contactEmail("ops@sunsetholdings.com")
                .contactPhone("+1 555-0129")
                .build();

        Customer cust4 = Customer.builder()
                .id("cust-4")
                .name("Tech Park Ltd")
                .contactEmail("maintenance@techpark.com")
                .contactPhone("+1 555-0143")
                .build();

        customerRepository.save(cust1);
        customerRepository.save(cust2);
        customerRepository.save(cust3);
        customerRepository.save(cust4);

        // 3. Seed Sites
        Site site1 = Site.builder()
                .id("site-1")
                .customer(cust1)
                .name("Acme HQ - Tower A")
                .address("100 Innovation Way, Suite 400")
                .build();

        Site site2 = Site.builder()
                .id("site-2")
                .customer(cust2)
                .name("Global Logistics Hub")
                .address("450 Industrial Pkwy, Bldg 2")
                .build();

        Site site3 = Site.builder()
                .id("site-3")
                .customer(cust3)
                .name("Sunset Commercial Plaza")
                .address("880 Sunset Blvd, Floor 3")
                .build();

        Site site4 = Site.builder()
                .id("site-4")
                .customer(cust4)
                .name("Tech Park Center")
                .address("12 Technology Dr, Bldg C")
                .build();

        siteRepository.save(site1);
        siteRepository.save(site2);
        siteRepository.save(site3);
        siteRepository.save(site4);

        // 4. Seed Parts
        Part part1 = Part.builder()
                .id("part-1")
                .name("HVAC Air Filter 20x25x1")
                .sku("FLT-HVAC-2025")
                .unitCost(BigDecimal.valueOf(24.50))
                .stockQty(45)
                .build();

        Part part2 = Part.builder()
                .id("part-2")
                .name("R-410A Refrigerant 25lb")
                .sku("REF-R410A-25")
                .unitCost(BigDecimal.valueOf(185.00))
                .stockQty(12)
                .build();

        Part part3 = Part.builder()
                .id("part-3")
                .name("20A Dual-Pole Breaker")
                .sku("ELC-BRK-20A")
                .unitCost(BigDecimal.valueOf(38.00))
                .stockQty(30)
                .build();

        Part part4 = Part.builder()
                .id("part-4")
                .name("Commercial Pipe Sealant 500ml")
                .sku("PLM-SLT-500")
                .unitCost(BigDecimal.valueOf(18.25))
                .stockQty(18)
                .build();

        Part part5 = Part.builder()
                .id("part-5")
                .name("Heavy Duty Contactor 30A")
                .sku("ELC-CNT-30A")
                .unitCost(BigDecimal.valueOf(52.00))
                .stockQty(8)
                .build();

        partRepository.save(part1);
        partRepository.save(part2);
        partRepository.save(part3);
        partRepository.save(part4);
        partRepository.save(part5);

        // 5. Seed Work Orders
        WorkOrder wo1 = WorkOrder.builder()
                .id("WO-1001")
                .code("WO-1001")
                .title("AC not cooling in Main Conference Room")
                .description("Chiller compressor tripping on high pressure cutout. Needs refrigerant check and filter coil cleaning.")
                .priority(Priority.HIGH)
                .status(WorkOrderStatus.IN_PROGRESS)
                .slaDueAt(now.plusDays(1))
                .createdAt(now.minusDays(1))
                .customer(cust1)
                .site(site1)
                .assignedTo(tech1)
                .partsCost(BigDecimal.valueOf(49.00))
                .laborMinutes(90)
                .build();

        WorkOrder wo2 = WorkOrder.builder()
                .id("WO-1002")
                .code("WO-1002")
                .title("Electrical failure on 3rd Floor Lighting Circuit")
                .description("Main breaker tripping intermittently under load. Suspect damaged wiring near distribution panel 3B.")
                .priority(Priority.MEDIUM)
                .status(WorkOrderStatus.ASSIGNED)
                .slaDueAt(now.plusDays(2))
                .createdAt(now.minusDays(1))
                .customer(cust2)
                .site(site2)
                .assignedTo(tech2)
                .partsCost(BigDecimal.ZERO)
                .laborMinutes(0)
                .build();

        WorkOrder wo3 = WorkOrder.builder()
                .id("WO-1003")
                .code("WO-1003")
                .title("Pipe leakage under West Wing Restroom Sink")
                .description("Water leaking onto tile floor. Main shutoff valve bypassed temporarily. Requires sealant and fitting replace.")
                .priority(Priority.LOW)
                .status(WorkOrderStatus.ON_HOLD)
                .slaDueAt(now.plusDays(3))
                .createdAt(now.minusDays(2))
                .customer(cust3)
                .site(site3)
                .assignedTo(tech3)
                .partsCost(BigDecimal.valueOf(18.25))
                .laborMinutes(45)
                .build();

        WorkOrder wo4 = WorkOrder.builder()
                .id("WO-1004")
                .code("WO-1004")
                .title("Routine maintenance of Emergency Backup Generator")
                .description("Quarterly oil level check, battery load test, and automatic transfer switch (ATS) simulation test.")
                .priority(Priority.LOW)
                .status(WorkOrderStatus.NEW)
                .slaDueAt(now.plusDays(4))
                .createdAt(now)
                .customer(cust4)
                .site(site4)
                .assignedTo(null)
                .partsCost(BigDecimal.ZERO)
                .laborMinutes(0)
                .build();

        WorkOrder wo5 = WorkOrder.builder()
                .id("WO-1005")
                .code("WO-1005")
                .title("Generator failed start test during power outage test")
                .description("Starter motor clicking without turning engine over. Check battery voltage and starter solenoid relay.")
                .priority(Priority.URGENT)
                .status(WorkOrderStatus.IN_PROGRESS)
                .slaDueAt(now.minusHours(2)) // Breached SLA
                .createdAt(now.minusDays(2))
                .customer(cust1)
                .site(site1)
                .assignedTo(tech1)
                .partsCost(BigDecimal.valueOf(52.00))
                .laborMinutes(120)
                .build();

        workOrderRepository.save(wo1);
        workOrderRepository.save(wo2);
        workOrderRepository.save(wo3);
        workOrderRepository.save(wo4);
        workOrderRepository.save(wo5);

        // 6. Seed Status History
        WorkOrderStatusHistory hist1 = WorkOrderStatusHistory.builder()
                .id("hist-1")
                .workOrder(wo1)
                .fromStatus(null)
                .toStatus(WorkOrderStatus.NEW)
                .changedByUser(customerUser)
                .changedAt(now.minusDays(1).minusHours(2))
                .note("Request raised via customer portal")
                .build();

        WorkOrderStatusHistory hist2 = WorkOrderStatusHistory.builder()
                .id("hist-2")
                .workOrder(wo1)
                .fromStatus(WorkOrderStatus.NEW)
                .toStatus(WorkOrderStatus.ASSIGNED)
                .changedByUser(dispatcher)
                .changedAt(now.minusDays(1).minusHours(1))
                .note("Assigned to HVAC Lead Mike Smith")
                .build();

        WorkOrderStatusHistory hist3 = WorkOrderStatusHistory.builder()
                .id("hist-3")
                .workOrder(wo1)
                .fromStatus(WorkOrderStatus.ASSIGNED)
                .toStatus(WorkOrderStatus.IN_PROGRESS)
                .changedByUser(tech1)
                .changedAt(now.minusDays(1))
                .note("Arrived on site. Diagnosing pressure trip.")
                .build();

        historyRepository.save(hist1);
        historyRepository.save(hist2);
        historyRepository.save(hist3);

        // 7. Seed Part Usage
        PartUsage pu1 = PartUsage.builder()
                .id("pu-1")
                .workOrder(wo1)
                .part(part1)
                .partName(part1.getName())
                .unitCost(part1.getUnitCost())
                .qtyUsed(2)
                .totalCost(BigDecimal.valueOf(49.00))
                .loggedAt(now.minusHours(5))
                .build();

        PartUsage pu2 = PartUsage.builder()
                .id("pu-2")
                .workOrder(wo3)
                .part(part4)
                .partName(part4.getName())
                .unitCost(part4.getUnitCost())
                .qtyUsed(1)
                .totalCost(BigDecimal.valueOf(18.25))
                .loggedAt(now.minusHours(8))
                .build();

        partUsageRepository.save(pu1);
        partUsageRepository.save(pu2);

        // 8. Seed Time Logs
        TimeLog tl1 = TimeLog.builder()
                .id("tl-1")
                .workOrder(wo1)
                .technician(tech1)
                .minutes(90)
                .note("Filter cleaning and compressor test run")
                .createdAt(now.minusHours(4))
                .build();

        TimeLog tl2 = TimeLog.builder()
                .id("tl-2")
                .workOrder(wo3)
                .technician(tech3)
                .minutes(45)
                .note("Applied pipe sealant and leak check")
                .createdAt(now.minusHours(7))
                .build();

        timeLogRepository.save(tl1);
        timeLogRepository.save(tl2);

        // 9. Seed Notifications
        NotificationItem n1 = NotificationItem.builder()
                .id("notif-1")
                .title("SLA Breach Alert")
                .message("Urgent Job WO-1005 (Acme Corp) has breached resolution SLA window.")
                .type(NotificationType.SLA_BREACH)
                .timestamp(now.minusHours(1))
                .read(false)
                .workOrderId("WO-1005")
                .build();

        NotificationItem n2 = NotificationItem.builder()
                .id("notif-2")
                .title("Job Assigned")
                .message("WO-1002 assigned to Sarah Johnson for Global Logistics Hub.")
                .type(NotificationType.ASSIGNMENT)
                .timestamp(now.minusDays(1))
                .read(false)
                .workOrderId("WO-1002")
                .build();

        NotificationItem n3 = NotificationItem.builder()
                .id("notif-3")
                .title("Low Stock Inventory Alert")
                .message("Heavy Duty Contactor 30A stock is down to 8 units.")
                .type(NotificationType.INVENTORY)
                .timestamp(now.minusDays(1))
                .read(true)
                .build();

        notificationRepository.save(n1);
        notificationRepository.save(n2);
        notificationRepository.save(n3);

        logger.info("KEYSTONE demo seed data initialized successfully!");
    }
}
