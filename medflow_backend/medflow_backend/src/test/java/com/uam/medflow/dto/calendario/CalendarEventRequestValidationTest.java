package com.uam.medflow.dto.calendario;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;

import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class CalendarEventRequestValidationTest {

    @Test
    void rechazaCamposObligatoriosVaciosONulos() {
        CalendarEventRequest request = new CalendarEventRequest(
                null,
                " ",
                null,
                null,
                null);

        Set<ConstraintViolation<CalendarEventRequest>> violations = validar(request);

        assertTrue(contieneMensaje(violations, "El doctor es obligatorio"));
        assertTrue(contieneMensaje(violations, "El titulo es obligatorio"));
        assertTrue(contieneMensaje(violations, "La fecha y hora de inicio son obligatorias"));
        assertTrue(contieneMensaje(violations, "La fecha y hora de fin son obligatorias"));
    }

    private Set<ConstraintViolation<CalendarEventRequest>> validar(CalendarEventRequest request) {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            Validator validator = factory.getValidator();
            return validator.validate(request);
        }
    }

    private boolean contieneMensaje(Set<ConstraintViolation<CalendarEventRequest>> violations, String mensaje) {
        return violations.stream()
                .anyMatch(violation -> mensaje.equals(violation.getMessage()));
    }
}
