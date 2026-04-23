package com.uam.medflow.dto.calendario;

import java.time.LocalDateTime;

public record CalendarEventResponse(
        Integer id,
        String tipo,
        String titulo,
        String descripcion,
        LocalDateTime inicio,
        LocalDateTime fin,
        String estado,
        Integer doctorId,
        String doctorNombre,
        Integer pacienteId,
        String pacienteNombre,
        Integer citaId,
        Integer eventoId,
        Integer procedimientoId,
        String procedimientoNombre
) {}