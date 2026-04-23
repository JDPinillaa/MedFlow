package com.uam.medflow.dto.doctor;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;

import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class DoctorRequestValidationTest {

    @Test
    void rechazaCamposObligatoriosVacios() {
        DoctorRequest request = new DoctorRequest(
                " ",
                " ",
                " ",
                " ");

        Set<ConstraintViolation<DoctorRequest>> violations = validar(request);

        assertTrue(contieneMensaje(violations, "El nombre completo es obligatorio"));
        assertTrue(contieneMensaje(violations, "La especialidad es obligatoria"));
        assertTrue(contieneMensaje(violations, "El registro medico es obligatorio"));
        assertTrue(contieneMensaje(violations, "El email es obligatorio"));
    }

    private Set<ConstraintViolation<DoctorRequest>> validar(DoctorRequest request) {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            Validator validator = factory.getValidator();
            return validator.validate(request);
        }
    }

    private boolean contieneMensaje(Set<ConstraintViolation<DoctorRequest>> violations, String mensaje) {
        return violations.stream()
                .anyMatch(violation -> mensaje.equals(violation.getMessage()));
    }
}
