package com.uam.medflow.servicios;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.uam.medflow.dto.doctor.DoctorRequest;
import com.uam.medflow.dto.doctor.DoctorResponse;
import com.uam.medflow.entidades.Doctor;
import com.uam.medflow.excepciones.ConflictoException;
import com.uam.medflow.repositorios.DoctorRepository;

@ExtendWith(MockitoExtension.class)
class DoctorServiceTest {

    @Mock
    private DoctorRepository doctorRepository;

    @InjectMocks
    private DoctorService doctorService;

    @Test
    void actualizarModificaDoctorExistenteConDatosNormalizados() {
        Doctor doctor = doctorExistente();
        DoctorRequest request = new DoctorRequest(
                "  Dra. Laura Gomez  ",
                "  Cardiologia  ",
                "  RM-002  ",
                "  LAURA.GOMEZ@MEDFLOW.COM  ");

        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));
        when(doctorRepository.existsByRegistroMedicoIgnoreCaseAndIdNot("RM-002", 1)).thenReturn(false);
        when(doctorRepository.existsByEmailIgnoreCaseAndIdNot("laura.gomez@medflow.com", 1)).thenReturn(false);
        when(doctorRepository.save(any(Doctor.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DoctorResponse resultado = doctorService.actualizar(1, request);

        assertEquals(1, resultado.id());
        assertEquals("Dra. Laura Gomez", resultado.nombreCompleto());
        assertEquals("Cardiologia", resultado.especialidad());
        assertEquals("RM-002", resultado.registroMedico());
        assertEquals("laura.gomez@medflow.com", resultado.email());
        verify(doctorRepository).save(doctor);
    }

    @Test
    void actualizarRechazaCorreoAsignadoAOtroDoctor() {
        Doctor doctor = doctorExistente();
        DoctorRequest request = new DoctorRequest(
                "Dra. Laura Gomez",
                "Cardiologia",
                "RM-002",
                " usado@medflow.com ");

        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));
        when(doctorRepository.existsByRegistroMedicoIgnoreCaseAndIdNot("RM-002", 1)).thenReturn(false);
        when(doctorRepository.existsByEmailIgnoreCaseAndIdNot("usado@medflow.com", 1)).thenReturn(true);

        ConflictoException exception = assertThrows(
                ConflictoException.class,
                () -> doctorService.actualizar(1, request));

        assertEquals("El correo usado@medflow.com ya esta en uso", exception.getMessage());
        verify(doctorRepository, never()).save(any(Doctor.class));
    }

    @Test
    void actualizarRechazaRegistroMedicoDuplicadoConEspacios() {
        Doctor doctor = doctorExistente();
        DoctorRequest request = new DoctorRequest(
                "Dra. Laura Gomez",
                "Cardiologia",
                " RM-001 ",
                "laura.gomez@medflow.com");

        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));
        when(doctorRepository.existsByRegistroMedicoIgnoreCaseAndIdNot("RM-001", 1)).thenReturn(true);

        ConflictoException exception = assertThrows(
                ConflictoException.class,
                () -> doctorService.actualizar(1, request));

        assertEquals("Ya existe un doctor con el registro medico RM-001", exception.getMessage());
        verify(doctorRepository, never()).save(any(Doctor.class));
    }

    private Doctor doctorExistente() {
        Doctor doctor = new Doctor();
        doctor.setId(1);
        doctor.setNombreCompleto("Dr. Juan Perez");
        doctor.setEspecialidad("Medicina General");
        doctor.setRegistroMedico("RM-000");
        doctor.setEmail("juan.perez@medflow.com");
        return doctor;
    }
}
