package com.uam.medflow.excepciones;

import java.util.List;

public record ApiErrorResponse(String mensaje, List<String> errores) {
}
