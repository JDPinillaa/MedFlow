package com.uam.medflow.dto.auth;

public record LoginResponse(
        String token,
        Integer usuarioId,
        String email,
        String rol
) {}