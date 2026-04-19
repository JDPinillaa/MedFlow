package com.uam.medflow.dto.doctor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DoctorRequest(
        @NotBlank(message = "El nombre completo es obligatorio")
        @Size(max = 150, message = "El nombre completo no puede superar los 150 caracteres")
        String nombreCompleto,

        @NotBlank(message = "La especialidad es obligatoria")
        @Size(max = 100, message = "La especialidad no puede superar los 100 caracteres")
        String especialidad,

        @NotBlank(message = "El registro medico es obligatorio")
        @Size(max = 80, message = "El registro medico no puede superar los 80 caracteres")
        String registroMedico,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email debe tener un formato valido")
        @Size(max = 120, message = "El email no puede superar los 120 caracteres")
        String email) {
}
