package com.uam.medflow.controladores;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uam.medflow.dto.auth.LoginRequest;
import com.uam.medflow.dto.auth.LoginResponse;
import com.uam.medflow.servicios.AuthService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
