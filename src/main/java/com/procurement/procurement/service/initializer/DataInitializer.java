package com.procurement.procurement.service.initializer;

import com.procurement.procurement.entity.user.Role;
import com.procurement.procurement.entity.user.User;
import com.procurement.procurement.repository.user.RoleRepository;
import com.procurement.procurement.repository.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // ===================== CREATE ROLES =====================

        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(
                        new Role("ROLE_ADMIN", "System Administrator")
                ));

        Role managerRole = roleRepository.findByName("ROLE_PROCUREMENT_MANAGER")
                .orElseGet(() -> roleRepository.save(
                        new Role("ROLE_PROCUREMENT_MANAGER", "Procurement Manager")
                ));

        Role employeeRole = roleRepository.findByName("ROLE_EMPLOYEE")
                .orElseGet(() -> roleRepository.save(
                        new Role("ROLE_EMPLOYEE", "Normal Employee")
                ));

        System.out.println("✅ Roles Initialized");

        // ===================== CREATE DEFAULT ADMIN =====================

        if (userRepository.findByUsername("admin").isEmpty()) {

            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@example.com");

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);

            admin.setRoles(roles);

            userRepository.save(admin);

            System.out.println("✅ Default Admin Created");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
        }
    }
}
