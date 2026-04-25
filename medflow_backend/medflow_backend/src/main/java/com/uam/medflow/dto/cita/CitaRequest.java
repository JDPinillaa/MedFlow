package com.uam.medflow.dto.cita;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CitaRequest(
        @NotNull(message = "El paciente es obligatorio")
        Integer pacienteId,

        @NotNull(message = "El doctor es obligatorio")
        Integer doctorId,

        @NotNull(message = "El procedimiento es obligatorio")
        Integer procedimientoId,

        @NotNull(message = "La fecha y hora son obligatorias")
        @FutureOrPresent(message = "La cita debe programarse en una fecha futura")
        LocalDateTime fechaHora,

        @Size(max = 50, message = "El estado no puede superar los 50 caracteres")
        String estado) {
}
