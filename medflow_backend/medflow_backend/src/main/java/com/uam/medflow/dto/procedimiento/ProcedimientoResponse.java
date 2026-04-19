package com.uam.medflow.dto.procedimiento;

import java.math.BigDecimal;

public record ProcedimientoResponse(
        Integer id,
        String nombre,
        BigDecimal precio,
        Integer duracionMinutos) {
}
