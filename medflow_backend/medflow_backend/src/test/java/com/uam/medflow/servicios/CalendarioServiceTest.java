package com.uam.medflow.servicios;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.uam.medflow.dto.calendario.CalendarEventRequest;
import com.uam.medflow.dto.calendario.CalendarEventResponse;
import com.uam.medflow.entidades.CalendarEvent;
import com.uam.medflow.entidades.Cita;
import com.uam.medflow.entidades.Doctor;
import com.uam.medflow.entidades.Paciente;
import com.uam.medflow.entidades.Procedimiento;
import com.uam.medflow.excepciones.ConflictoException;
import com.uam.medflow.repositorios.CalendarEventRepository;
import com.uam.medflow.repositorios.CitaRepository;

@ExtendWith(MockitoExtension.class)
class CalendarioServiceTest {

    @Mock
    private CalendarEventRepository calendarEventRepository;

    @Mock
    private CitaRepository citaRepository;

    @Mock
    private DoctorService doctorService;

    @InjectMocks
    private CalendarioService calendarioService;

    @Test
    void verCalendarioIntegraCitasYEventosOrdenadosYCalculaFinDeCita() {
        LocalDateTime desde = LocalDateTime.of(2026, 5, 10, 0, 0);
        LocalDateTime hasta = LocalDateTime.of(2026, 5, 11, 0, 0);
        Cita cita = citaBase(LocalDateTime.of(2026, 5, 10, 10, 0), 45);
        CalendarEvent evento = eventoBase(
                LocalDateTime.of(2026, 5, 10, 8, 0),
                LocalDateTime.of(2026, 5, 10, 9, 0));

        when(doctorService.buscarEntidad(1)).thenReturn(doctorBase());
        when(citaRepository.buscarPorDoctorYRango(1, desde, hasta)).thenReturn(List.of(cita));
        when(calendarEventRepository.buscarPorDoctorYRango(1, desde, hasta)).thenReturn(List.of(evento));

        List<CalendarEventResponse> resultado = calendarioService.verCalendario(1, desde, hasta);

        assertEquals(2, resultado.size());
        assertEquals("EVENTO", resultado.get(0).tipo());
        assertEquals("CITA", resultado.get(1).tipo());
        assertEquals(LocalDateTime.of(2026, 5, 10, 10, 45), resultado.get(1).fin());
        assertEquals("Consulta General - Ana Perez", resultado.get(1).titulo());
        assertEquals(1, resultado.get(1).citaId());
        assertEquals(5, resultado.get(0).eventoId());
    }

    @Test
    void crearEventoGuardaEventoConDatosNormalizados() {
        LocalDateTime inicio = LocalDateTime.of(2026, 5, 10, 14, 0);
        LocalDateTime fin = LocalDateTime.of(2026, 5, 10, 15, 0);
        CalendarEventRequest request = new CalendarEventRequest(
                1,
                "  Reunion administrativa  ",
                "  Revision de agenda semanal  ",
                inicio,
                fin);

        when(doctorService.buscarEntidad(1)).thenReturn(doctorBase());
        when(calendarEventRepository.existeCruceEvento(1, inicio, fin)).thenReturn(false);
        when(citaRepository.buscarCitasActivasParaCruceCalendario(1, inicio.minusDays(1), fin)).thenReturn(List.of());
        when(calendarEventRepository.save(any(CalendarEvent.class))).thenAnswer(invocation -> {
            CalendarEvent event = invocation.getArgument(0);
            event.setId(7);
            return event;
        });

        CalendarEventResponse resultado = calendarioService.crearEvento(request);

        ArgumentCaptor<CalendarEvent> captor = ArgumentCaptor.forClass(CalendarEvent.class);
        verify(calendarEventRepository).save(captor.capture());
        assertEquals("Reunion administrativa", captor.getValue().getTitulo());
        assertEquals("Revision de agenda semanal", captor.getValue().getDescripcion());
        assertEquals(7, resultado.eventoId());
        assertEquals("EVENTO", resultado.tipo());
        assertEquals("Dra. Laura Gomez", resultado.doctorNombre());
    }

    @Test
    void crearEventoRechazaFinAnteriorOIgualAlInicio() {
        LocalDateTime inicio = LocalDateTime.of(2026, 5, 10, 15, 0);
        CalendarEventRequest request = new CalendarEventRequest(
                1,
                "Bloqueo agenda",
                null,
                inicio,
                inicio);

        ConflictoException exception = assertThrows(
                ConflictoException.class,
                () -> calendarioService.crearEvento(request));

        assertEquals("La fecha y hora de fin debe ser posterior al inicio", exception.getMessage());
        verifyNoInteractions(doctorService, calendarEventRepository, citaRepository);
    }

    @Test
    void crearEventoRechazaCruceConOtroEvento() {
        LocalDateTime inicio = LocalDateTime.of(2026, 5, 10, 14, 0);
        LocalDateTime fin = LocalDateTime.of(2026, 5, 10, 15, 0);
        CalendarEventRequest request = requestEvento(inicio, fin);

        when(doctorService.buscarEntidad(1)).thenReturn(doctorBase());
        when(calendarEventRepository.existeCruceEvento(1, inicio, fin)).thenReturn(true);

        ConflictoException exception = assertThrows(
                ConflictoException.class,
                () -> calendarioService.crearEvento(request));

        assertEquals("El doctor ya tiene un evento programado en ese rango de tiempo", exception.getMessage());
        verify(citaRepository, never()).buscarCitasActivasParaCruceCalendario(any(), any(), any());
        verify(calendarEventRepository, never()).save(any(CalendarEvent.class));
    }

    @Test
    void crearEventoRechazaCruceConCitaActiva() {
        LocalDateTime inicio = LocalDateTime.of(2026, 5, 10, 14, 0);
        LocalDateTime fin = LocalDateTime.of(2026, 5, 10, 15, 0);
        CalendarEventRequest request = requestEvento(inicio, fin);
        Cita cita = citaBase(LocalDateTime.of(2026, 5, 10, 14, 30), 30);

        when(doctorService.buscarEntidad(1)).thenReturn(doctorBase());
        when(calendarEventRepository.existeCruceEvento(1, inicio, fin)).thenReturn(false);
        when(citaRepository.buscarCitasActivasParaCruceCalendario(1, inicio.minusDays(1), fin)).thenReturn(List.of(cita));

        ConflictoException exception = assertThrows(
                ConflictoException.class,
                () -> calendarioService.crearEvento(request));

        assertEquals("El doctor ya tiene una cita programada en ese rango de tiempo", exception.getMessage());
        verify(calendarEventRepository, never()).save(any(CalendarEvent.class));
    }

    private CalendarEventRequest requestEvento(LocalDateTime inicio, LocalDateTime fin) {
        return new CalendarEventRequest(
                1,
                "Reunion administrativa",
                "Revision de agenda semanal",
                inicio,
                fin);
    }

    private CalendarEvent eventoBase(LocalDateTime inicio, LocalDateTime fin) {
        CalendarEvent event = new CalendarEvent();
        event.setId(5);
        event.setDoctor(doctorBase());
        event.setTitulo("Reunion administrativa");
        event.setDescripcion("Revision de agenda semanal");
        event.setInicio(inicio);
        event.setFin(fin);
        return event;
    }

    private Cita citaBase(LocalDateTime fechaHora, int duracionMinutos) {
        Cita cita = new Cita();
        cita.setId(1);
        cita.setPaciente(pacienteBase());
        cita.setDoctor(doctorBase());
        cita.setProcedimiento(procedimientoBase(duracionMinutos));
        cita.setFechaHora(fechaHora);
        cita.setEstado("PROGRAMADA");
        return cita;
    }

    private Doctor doctorBase() {
        Doctor doctor = new Doctor();
        doctor.setId(1);
        doctor.setNombreCompleto("Dra. Laura Gomez");
        doctor.setEspecialidad("Medicina General");
        doctor.setRegistroMedico("RM-001");
        doctor.setEmail("laura.gomez@medflow.com");
        return doctor;
    }

    private Paciente pacienteBase() {
        Paciente paciente = new Paciente();
        paciente.setId(2);
        paciente.setNombreCompleto("Ana Perez");
        return paciente;
    }

    private Procedimiento procedimientoBase(int duracionMinutos) {
        Procedimiento procedimiento = new Procedimiento();
        procedimiento.setId(3);
        procedimiento.setNombre("Consulta General");
        procedimiento.setPrecio(BigDecimal.valueOf(120000));
        procedimiento.setDuracionMinutos(duracionMinutos);
        return procedimiento;
    }
}
