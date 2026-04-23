package com.uam.medflow.servicios;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.uam.medflow.dto.historia.HistoriaClinicaRequest;
import com.uam.medflow.dto.historia.HistoriaClinicaResponse;
import com.uam.medflow.entidades.Cita;
import com.uam.medflow.entidades.Doctor;
import com.uam.medflow.entidades.HistoriaClinica;
import com.uam.medflow.entidades.Paciente;
import com.uam.medflow.entidades.Procedimiento;
import com.uam.medflow.excepciones.ConflictoException;
import com.uam.medflow.excepciones.RecursoNoEncontradoException;
import com.uam.medflow.repositorios.HistoriaClinicaRepository;

@ExtendWith(MockitoExtension.class)
class HistoriaClinicaServiceTest {

    @Mock
    private HistoriaClinicaRepository historiaClinicaRepository;

    @Mock
    private CitaService citaService;

    @Mock
    private PacienteService pacienteService;

    @InjectMocks
    private HistoriaClinicaService historiaClinicaService;

    @Test
    void crearRegistraHistoriaConPacienteDeLaCitaYMarcaCitaCompletada() {
        Cita cita = citaBase("PROGRAMADA");
        HistoriaClinicaRequest request = new HistoriaClinicaRequest(
                1,
                "  Faringitis aguda  ",
                "  Dolor de garganta de dos dias  ",
                "  Sin alergias reportadas  ");

        when(citaService.buscarEntidad(1)).thenReturn(cita);
        when(historiaClinicaRepository.existsByCitaId(1)).thenReturn(false);
        when(historiaClinicaRepository.save(any(HistoriaClinica.class))).thenAnswer(invocation -> {
            HistoriaClinica historiaClinica = invocation.getArgument(0);
            historiaClinica.setId(10);
            return historiaClinica;
        });

        HistoriaClinicaResponse resultado = historiaClinicaService.crear(request);

        assertEquals(10, resultado.id());
        assertEquals(1, resultado.citaId());
        assertEquals("COMPLETADA", resultado.citaEstado());
        assertEquals("COMPLETADA", cita.getEstado());
        assertEquals(11, resultado.pacienteId());
        assertEquals("Ana Perez", resultado.pacienteNombre());
        assertEquals(21, resultado.doctorId());
        assertEquals("Dra. Laura Gomez", resultado.doctorNombre());
        assertEquals("Faringitis aguda", resultado.diagnostico());
        assertEquals("Dolor de garganta de dos dias", resultado.observaciones());
        assertEquals("Sin alergias reportadas", resultado.datosRelevantes());
        assertNotNull(resultado.fechaRegistro());
    }

    @Test
    void crearRechazaHistoriaParaCitaCancelada() {
        Cita cita = citaBase("CANCELADA");
        HistoriaClinicaRequest request = requestValido();

        when(citaService.buscarEntidad(1)).thenReturn(cita);
        when(historiaClinicaRepository.existsByCitaId(1)).thenReturn(false);

        ConflictoException exception = assertThrows(
                ConflictoException.class,
                () -> historiaClinicaService.crear(request));

        assertEquals("No se puede crear historia clinica para una cita cancelada", exception.getMessage());
        verify(historiaClinicaRepository, never()).save(any(HistoriaClinica.class));
    }

    @Test
    void crearRechazaHistoriaDuplicadaParaLaMismaCita() {
        Cita cita = citaBase("PROGRAMADA");
        HistoriaClinicaRequest request = requestValido();

        when(citaService.buscarEntidad(1)).thenReturn(cita);
        when(historiaClinicaRepository.existsByCitaId(1)).thenReturn(true);

        ConflictoException exception = assertThrows(
                ConflictoException.class,
                () -> historiaClinicaService.crear(request));

        assertEquals("La cita ya tiene una historia clinica registrada", exception.getMessage());
        assertEquals("PROGRAMADA", cita.getEstado());
        verify(historiaClinicaRepository, never()).save(any(HistoriaClinica.class));
    }

    @Test
    void listarPorPacienteValidaPacienteYDevuelveHistoriaCompleta() {
        HistoriaClinica historiaClinica = historiaBase();

        when(pacienteService.buscarEntidad(11)).thenReturn(historiaClinica.getPaciente());
        when(historiaClinicaRepository.findByPacienteConRelaciones(11)).thenReturn(List.of(historiaClinica));

        List<HistoriaClinicaResponse> resultado = historiaClinicaService.listarPorPaciente(11);

        verify(pacienteService).buscarEntidad(11);
        assertEquals(1, resultado.size());
        assertEquals(10, resultado.get(0).id());
        assertEquals("Faringitis aguda", resultado.get(0).diagnostico());
        assertEquals("Dolor de garganta de dos dias", resultado.get(0).observaciones());
        assertEquals("Sin alergias reportadas", resultado.get(0).datosRelevantes());
        assertEquals(1, resultado.get(0).citaId());
        assertEquals(11, resultado.get(0).pacienteId());
        assertEquals("Ana Perez", resultado.get(0).pacienteNombre());
        assertEquals(21, resultado.get(0).doctorId());
        assertEquals("Dra. Laura Gomez", resultado.get(0).doctorNombre());
        assertEquals("Medicina General", resultado.get(0).doctorEspecialidad());
        assertEquals(31, resultado.get(0).procedimientoId());
        assertEquals("Consulta General", resultado.get(0).procedimientoNombre());
    }

    @Test
    void obtenerPorIdRechazaHistoriaInexistente() {
        when(historiaClinicaRepository.findConRelacionesById(99)).thenReturn(Optional.empty());

        RecursoNoEncontradoException exception = assertThrows(
                RecursoNoEncontradoException.class,
                () -> historiaClinicaService.obtenerPorId(99));

        assertEquals("Historia clinica no encontrada con id 99", exception.getMessage());
    }

    private HistoriaClinicaRequest requestValido() {
        return new HistoriaClinicaRequest(
                1,
                "Faringitis aguda",
                "Dolor de garganta de dos dias",
                "Sin alergias reportadas");
    }

    private Cita citaBase(String estado) {
        Paciente paciente = new Paciente();
        paciente.setId(11);
        paciente.setNombreCompleto("Ana Perez");

        Doctor doctor = new Doctor();
        doctor.setId(21);
        doctor.setNombreCompleto("Dra. Laura Gomez");
        doctor.setEspecialidad("Medicina General");

        Procedimiento procedimiento = new Procedimiento();
        procedimiento.setId(31);
        procedimiento.setNombre("Consulta General");
        procedimiento.setPrecio(BigDecimal.valueOf(120000));
        procedimiento.setDuracionMinutos(30);

        Cita cita = new Cita();
        cita.setId(1);
        cita.setPaciente(paciente);
        cita.setDoctor(doctor);
        cita.setProcedimiento(procedimiento);
        cita.setFechaHora(LocalDateTime.of(2026, 5, 10, 9, 0));
        cita.setEstado(estado);
        return cita;
    }

    private HistoriaClinica historiaBase() {
        Cita cita = citaBase("COMPLETADA");

        HistoriaClinica historiaClinica = new HistoriaClinica();
        historiaClinica.setId(10);
        historiaClinica.setCita(cita);
        historiaClinica.setPaciente(cita.getPaciente());
        historiaClinica.setDoctor(cita.getDoctor());
        historiaClinica.setDiagnostico("Faringitis aguda");
        historiaClinica.setObservaciones("Dolor de garganta de dos dias");
        historiaClinica.setDatosRelevantes("Sin alergias reportadas");
        historiaClinica.setFechaRegistro(LocalDateTime.of(2026, 5, 10, 9, 30));
        return historiaClinica;
    }
}
