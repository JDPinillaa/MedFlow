package com.uam.medflow.servicios;

import com.uam.medflow.dto.calendario.CalendarEventRequest;
import com.uam.medflow.dto.calendario.CalendarEventResponse;
import com.uam.medflow.entidades.CalendarEvent;
import com.uam.medflow.entidades.Cita;
import com.uam.medflow.entidades.Doctor;
import com.uam.medflow.excepciones.ConflictoException;
import com.uam.medflow.repositorios.CalendarEventRepository;
import com.uam.medflow.repositorios.CitaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
@Transactional
public class CalendarioService {

    private final CalendarEventRepository calendarEventRepository;
    private final CitaRepository citaRepository;
    private final DoctorService doctorService;

    public CalendarioService(CalendarEventRepository calendarEventRepository, CitaRepository citaRepository, DoctorService doctorService) {
        this.calendarEventRepository = calendarEventRepository;
        this.citaRepository = citaRepository;
        this.doctorService = doctorService;
    }

    @Transactional(readOnly = true)
    public List<CalendarEventResponse> verCalendarioAdmin(LocalDateTime desde, LocalDateTime hasta) {
        validarRango(desde, hasta);

        List<CalendarEventResponse> citas = citaRepository.buscarPorRango(desde, hasta)
                .stream()
                .map(this::mapToResponse)
                .toList();

        List<CalendarEventResponse> eventos = calendarEventRepository.buscarPorRango(desde, hasta)
                .stream()
                .map(this::mapToResponse)
                .toList();

        return Stream.concat(citas.stream(), eventos.stream())
                .sorted(Comparator.comparing(CalendarEventResponse::inicio))
                .toList();
    }

    public CalendarEventResponse crearEvento(CalendarEventRequest request) {
        validarRango(request.inicio(), request.fin());

        if (!request.ignorarConflicto()) {
            boolean hayConflicto = calendarEventRepository.existeCruceEvento(request.doctorId(), request.inicio(), request.fin());
            if (hayConflicto) {
                throw new ConflictoException("Existe un conflicto de horario");
            }
        }

        Doctor doctor = doctorService.buscarEntidad(request.doctorId());

        CalendarEvent evento = new CalendarEvent();
        evento.setTitulo(request.titulo());
        evento.setDescripcion(request.descripcion());
        evento.setInicio(request.inicio());
        evento.setFin(request.fin());
        evento.setDoctor(doctor);

        return mapToResponse(calendarEventRepository.save(evento));
    }

    private void validarRango(LocalDateTime inicio, LocalDateTime fin) {
        if (fin.isBefore(inicio) || fin.isEqual(inicio)) {
            throw new ConflictoException("La fecha de fin debe ser posterior a la de inicio");
        }
    }

    private CalendarEventResponse mapToResponse(Cita cita) {
        return new CalendarEventResponse(
                cita.getId(),
                "CITA",
                "Cita: " + cita.getPaciente().getNombreCompleto(),
                cita.getProcedimiento().getNombre(),
                cita.getFechaHora(),
                cita.getFechaHora().plusMinutes(cita.getProcedimiento().getDuracionMinutos()),
                cita.getEstado(),
                cita.getDoctor().getId(),
                cita.getDoctor().getNombreCompleto(),
                cita.getPaciente().getId(),
                cita.getPaciente().getNombreCompleto(),
                cita.getId(),
                null,
                cita.getProcedimiento().getId(),
                cita.getProcedimiento().getNombre()
        );
    }

    private CalendarEventResponse mapToResponse(CalendarEvent event) {
        return new CalendarEventResponse(
                event.getId(),
                "EVENTO",
                event.getTitulo(),
                event.getDescripcion(),
                event.getInicio(),
                event.getFin(),
                "PROGRAMADO",
                event.getDoctor().getId(),
                event.getDoctor().getNombreCompleto(),
                null,
                null,
                null,
                event.getId(),
                null,
                null
        );
    }
}