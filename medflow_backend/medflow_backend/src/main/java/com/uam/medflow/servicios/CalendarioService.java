package com.uam.medflow.servicios;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uam.medflow.dto.calendario.CalendarEventRequest;
import com.uam.medflow.dto.calendario.CalendarEventResponse;
import com.uam.medflow.entidades.CalendarEvent;
import com.uam.medflow.entidades.Cita;
import com.uam.medflow.entidades.Doctor;
import com.uam.medflow.excepciones.ConflictoException;
import com.uam.medflow.repositorios.CalendarEventRepository;
import com.uam.medflow.repositorios.CitaRepository;

@Service
@Transactional
public class CalendarioService {

    private static final String TIPO_CITA = "CITA";
    private static final String TIPO_EVENTO = "EVENTO";

    private final CalendarEventRepository calendarEventRepository;
    private final CitaRepository citaRepository;
    private final DoctorService doctorService;

    public CalendarioService(
            CalendarEventRepository calendarEventRepository,
            CitaRepository citaRepository,
            DoctorService doctorService) {
        this.calendarEventRepository = calendarEventRepository;
        this.citaRepository = citaRepository;
        this.doctorService = doctorService;
    }

    @Transactional(readOnly = true)
    public List<CalendarEventResponse> verCalendario(Integer doctorId, LocalDateTime desde, LocalDateTime hasta) {
        validarRango(desde, hasta);
        doctorService.buscarEntidad(doctorId);

        List<CalendarEventResponse> citas = citaRepository.buscarPorDoctorYRango(doctorId, desde, hasta)
                .stream()
                .map(this::toCalendarResponse)
                .toList();

        List<CalendarEventResponse> eventos = calendarEventRepository.buscarPorDoctorYRango(doctorId, desde, hasta)
                .stream()
                .map(this::toCalendarResponse)
                .toList();

        return Stream.concat(citas.stream(), eventos.stream())
                .sorted(Comparator.comparing(CalendarEventResponse::inicio))
                .toList();
    }

    public CalendarEventResponse crearEvento(CalendarEventRequest request) {
        validarRango(request.inicio(), request.fin());

        Doctor doctor = doctorService.buscarEntidad(request.doctorId());

        if (calendarEventRepository.existeCruceEvento(request.doctorId(), request.inicio(), request.fin())) {
            throw new ConflictoException("El doctor ya tiene un evento programado en ese rango de tiempo");
        }

        if (existeCruceConCita(request.doctorId(), request.inicio(), request.fin())) {
            throw new ConflictoException("El doctor ya tiene una cita programada en ese rango de tiempo");
        }

        CalendarEvent event = new CalendarEvent();
        event.setDoctor(doctor);
        event.setTitulo(request.titulo().trim());
        event.setDescripcion(request.descripcion() == null ? null : request.descripcion().trim());
        event.setInicio(request.inicio());
        event.setFin(request.fin());

        return toCalendarResponse(calendarEventRepository.save(event));
    }

    private void validarRango(LocalDateTime inicio, LocalDateTime fin) {
        if (!fin.isAfter(inicio)) {
            throw new ConflictoException("La fecha y hora de fin debe ser posterior al inicio");
        }
    }

    private boolean existeCruceConCita(Integer doctorId, LocalDateTime inicio, LocalDateTime fin) {
        return citaRepository.buscarCitasActivasParaCruceCalendario(doctorId, inicio.minusDays(1), fin)
                .stream()
                .anyMatch(cita -> {
                    LocalDateTime citaInicio = cita.getFechaHora();
                    LocalDateTime citaFin = citaInicio.plusMinutes(cita.getProcedimiento().getDuracionMinutos());
                    return citaInicio.isBefore(fin) && citaFin.isAfter(inicio);
                });
    }

    private CalendarEventResponse toCalendarResponse(Cita cita) {
        LocalDateTime inicio = cita.getFechaHora();
        LocalDateTime fin = inicio.plusMinutes(cita.getProcedimiento().getDuracionMinutos());

        return new CalendarEventResponse(
                cita.getId(),
                TIPO_CITA,
                cita.getProcedimiento().getNombre() + " - " + cita.getPaciente().getNombreCompleto(),
                null,
                inicio,
                fin,
                cita.getEstado(),
                cita.getDoctor().getId(),
                cita.getDoctor().getNombreCompleto(),
                cita.getPaciente().getId(),
                cita.getPaciente().getNombreCompleto(),
                cita.getId(),
                null,
                cita.getProcedimiento().getId(),
                cita.getProcedimiento().getNombre());
    }

    private CalendarEventResponse toCalendarResponse(CalendarEvent event) {
        return new CalendarEventResponse(
                event.getId(),
                TIPO_EVENTO,
                event.getTitulo(),
                event.getDescripcion(),
                event.getInicio(),
                event.getFin(),
                null,
                event.getDoctor().getId(),
                event.getDoctor().getNombreCompleto(),
                null,
                null,
                null,
                event.getId(),
                null,
                null);
    }
}
