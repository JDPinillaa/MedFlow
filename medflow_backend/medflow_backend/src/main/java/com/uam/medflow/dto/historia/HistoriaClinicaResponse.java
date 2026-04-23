package com.uam.medflow.dto.historia;

import java.time.LocalDateTime;

public record HistoriaClinicaResponse(
        Integer id,
        LocalDateTime fechaRegistro,
        String observaciones,
        Integer citaId,
        LocalDateTime citaFechaHora,
        String citaEstado,
        Integer pacienteId,
        String pacienteNombre,
        Integer doctorId,
        String doctorNombre,
        String doctorEspecialidad,
        Integer procedimientoId,
        String procedimientoNombre) {
}
