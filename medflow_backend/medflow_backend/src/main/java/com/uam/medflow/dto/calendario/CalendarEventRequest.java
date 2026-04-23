package com.uam.medflow.dto.calendario;

import java.time.LocalDateTime;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CalendarEventRequest(
        @NotNull(message = "El doctor es obligatorio")
        Integer doctorId,

        @NotBlank(message = "El titulo es obligatorio")
        @Size(max = 150, message = "El titulo no puede superar los 150 caracteres")
        String titulo,

        @Size(max = 5000, message = "La descripcion no puede superar los 5000 caracteres")
        String descripcion,

        @NotNull(message = "La fecha y hora de inicio son obligatorias")
        @Future(message = "El evento debe iniciar en una fecha futura")
        LocalDateTime inicio,

        @NotNull(message = "La fecha y hora de fin son obligatorias")
        @Future(message = "El evento debe finalizar en una fecha futura")
        LocalDateTime fin,

        boolean ignorarConflicto
) {}