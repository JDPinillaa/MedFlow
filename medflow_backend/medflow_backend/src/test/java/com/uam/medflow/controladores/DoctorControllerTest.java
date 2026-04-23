package com.uam.medflow.controladores;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;

import com.uam.medflow.dto.doctor.DoctorRequest;
import com.uam.medflow.dto.doctor.DoctorResponse;
import com.uam.medflow.dto.doctor.DoctorUpdateResponse;
import com.uam.medflow.servicios.DoctorService;

class DoctorControllerTest {

    @Test
    void actualizarRetornaMensajeDeConfirmacion() {
        DoctorService doctorService = mock(DoctorService.class);
        DoctorController controller = new DoctorController(doctorService);
        DoctorRequest request = new DoctorRequest(
                "Dra. Laura Gomez",
                "Medicina General",
                "RM-001",
                "laura.gomez@medflow.com");
        DoctorResponse response = new DoctorResponse(
                1,
                "Dra. Laura Gomez",
                "Medicina General",
                "RM-001",
                "laura.gomez@medflow.com");

        when(doctorService.actualizar(1, request)).thenReturn(response);

        DoctorUpdateResponse resultado = controller.actualizar(1, request);

        assertEquals("Doctor actualizado correctamente", resultado.mensaje());
        assertEquals(response, resultado.doctor());
    }
}
