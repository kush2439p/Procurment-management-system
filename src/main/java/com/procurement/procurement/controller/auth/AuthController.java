package com.procurement.procurement.controller.auth;

import com.procurement.procurement.dto.auth.LoginRequestDTO;
import com.procurement.procurement.dto.auth.AuthResponseDTO;
import com.procurement.procurement.entity.user.Role;
import com.procurement.procurement.entity.user.User;
import com.procurement.procurement.repository.user.RoleRepository;
import com.procurement.procurement.repository.user.UserRepository;
import com.procurement.procurement.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final JwtTokenProvider jwtTokenProvider;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final RoleRepository roleRepository; // ✅ ADDED

        public AuthController(AuthenticationManager authenticationManager,
                        JwtTokenProvider jwtTokenProvider,
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        RoleRepository roleRepository) { // ✅ ADDED
                this.authenticationManager = authenticationManager;
                this.jwtTokenProvider = jwtTokenProvider;
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.roleRepository = roleRepository; // ✅ ADDED
        }

        // ===================== LOGIN =====================
        @PostMapping("/login")
        public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                loginRequest.getUsername(),
                                                loginRequest.getPassword()));

                User user = userRepository.findByUsername(authentication.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                String token = jwtTokenProvider.generateToken(user.getUsername());

                AuthResponseDTO response = new AuthResponseDTO();
                response.setId(user.getId());
                response.setToken(token);
                response.setType("Bearer");
                response.setUsername(user.getUsername());
                response.setRoles(
                                user.getRoles().stream()
                                                .map(r -> r.getName())
                                                .collect(Collectors.toSet()));

                return ResponseEntity.ok(response);
        }

        // ===================== REGISTER =====================
        @PostMapping("/register")
        public ResponseEntity<String> register(@RequestBody LoginRequestDTO request) {

                if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                        return ResponseEntity.badRequest().body("Username already exists");
                }

                // ✅ Auto assign ROLE_ADMIN — change to ROLE_EMPLOYEE for normal users
                Role defaultRole = roleRepository.findByName("ROLE_ADMIN")
                                .orElseThrow(() -> new RuntimeException(
                                                "ROLE_ADMIN not found in DB! Please insert it first."));

                User user = new User();
                user.setUsername(request.getUsername());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setEmail(request.getUsername() + "@procurement.com");
                user.setEnabled(true);
                user.addRole(defaultRole); // ✅ Role is now assigned on register

                userRepository.save(user);

                return ResponseEntity.ok("User registered successfully as " + defaultRole.getName());
        }
}