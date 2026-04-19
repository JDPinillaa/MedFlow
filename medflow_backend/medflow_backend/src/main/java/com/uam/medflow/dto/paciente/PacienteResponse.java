package com.uam.medflow.dto.paciente;

public record PacienteResponse(
        Integer id,
        String nombreCompleto,
        String documento,
        String telefono,
        String email,
        String direccion) {
}
