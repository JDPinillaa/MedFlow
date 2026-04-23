package com.uam.medflow.dto.historia;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record HistoriaClinicaRequest(
        @NotNull(message = "La cita es obligatoria")
        Integer citaId,

        @NotBlank(message = "Las observaciones son obligatorias")
        @Size(max = 5000, message = "Las observaciones no pueden superar los 5000 caracteres")
        String observaciones) {
}
