package com.uam.medflow.dto.historia;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;

import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class HistoriaClinicaRequestValidationTest {

    @Test
    void rechazaCamposObligatoriosVaciosONulos() {
        HistoriaClinicaRequest request = new HistoriaClinicaRequest(
                null,
                " ",
                " ",
                " ");

        Set<ConstraintViolation<HistoriaClinicaRequest>> violations = validar(request);

        assertTrue(contieneMensaje(violations, "La cita es obligatoria"));
        assertTrue(contieneMensaje(violations, "El diagnostico es obligatorio"));
        assertTrue(contieneMensaje(violations, "Las observaciones son obligatorias"));
        assertTrue(contieneMensaje(violations, "Los datos relevantes son obligatorios"));
    }

    private Set<ConstraintViolation<HistoriaClinicaRequest>> validar(HistoriaClinicaRequest request) {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            Validator validator = factory.getValidator();
            return validator.validate(request);
        }
    }

    private boolean contieneMensaje(Set<ConstraintViolation<HistoriaClinicaRequest>> violations, String mensaje) {
        return violations.stream()
                .anyMatch(violation -> mensaje.equals(violation.getMessage()));
    }
}
