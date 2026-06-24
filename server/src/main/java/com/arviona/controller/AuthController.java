package com.arviona.controller;

import com.arviona.dto.*;
import com.arviona.exception.BadRequestException;
import com.arviona.model.Institution;
import com.arviona.model.Role;
import com.arviona.model.User;
import com.arviona.repository.InstitutionRepository;
import com.arviona.repository.RoleRepository;
import com.arviona.repository.UserRepository;
import com.arviona.security.JwtUtils;
import com.arviona.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private InstitutionRepository institutionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwt = jwtUtils.generateJwtToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails.getUsername());

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                refreshToken,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                roles
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        Institution institution = institutionRepository.findById(registerRequest.getInstitutionId())
                .orElseThrow(() -> new BadRequestException("Error: Institution not found!"));

        // Determine Role
        String roleStr = registerRequest.getRole().toUpperCase();
        if (!roleStr.startsWith("ROLE_")) {
            roleStr = "ROLE_" + roleStr;
        }

        Role userRole = roleRepository.findByName(roleStr)
                .orElseThrow(() -> new BadRequestException("Error: Role '" + registerRequest.getRole() + "' is not supported."));

        // Create new user
        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .institution(institution)
                .roles(Collections.singleton(userRole))
                .createdBy("system")
                .build();

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshJwtToken(@Valid @RequestBody TokenRefreshRequest refreshRequest) {
        String requestRefreshToken = refreshRequest.getRefreshToken();

        if (jwtUtils.validateJwtToken(requestRefreshToken)) {
            String email = jwtUtils.getUserNameFromJwtToken(requestRefreshToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new BadRequestException("Error: Refresh token belongs to a non-existing user!"));

            UserDetailsImpl userDetails = UserDetailsImpl.build(user);
            String newAccessToken = jwtUtils.generateJwtToken(userDetails);
            String newRefreshToken = jwtUtils.generateRefreshToken(email); // Rotate Token

            return ResponseEntity.ok(new TokenRefreshResponse(newAccessToken, newRefreshToken));
        } else {
            throw new BadRequestException("Error: Refresh token is expired or invalid!");
        }
    }
}
