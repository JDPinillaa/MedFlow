package com.uam.medflow.dto.paciente;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PacienteRequest(
        @NotBlank(message = "El nombre completo es obligatorio")
        @Size(max = 150, message = "El nombre completo no puede superar los 150 caracteres")
        String nombreCompleto,

        @NotBlank(message = "El documento es obligatorio")
        @Size(max = 30, message = "El documento no puede superar los 30 caracteres")
        String documento,

        @NotBlank(message = "El telefono es obligatorio")
        @Size(max = 30, message = "El telefono no puede superar los 30 caracteres")
        String telefono,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email debe tener un formato valido")
        @Size(max = 120, message = "El email no puede superar los 120 caracteres")
        String email,

        @NotBlank(message = "La direccion es obligatoria")
        @Size(max = 200, message = "La direccion no puede superar los 200 caracteres")
        String direccion) {
}
