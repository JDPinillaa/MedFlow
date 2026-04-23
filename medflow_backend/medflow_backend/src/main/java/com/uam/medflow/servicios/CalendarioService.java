package com.uam.medflow.servicios;

import com.uam.medflow.dto.calendario.CalendarEventResponse;
import com.uam.medflow.entidades.CalendarEvent;
import com.uam.medflow.entidades.Cita;
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

    private static final String TIPO_CITA = "CITA";
    private static final String TIPO_EVENTO = "EVENTO";

    private final CalendarEventRepository calendarEventRepository;
    private final CitaRepository citaRepository;

    public CalendarioService(CalendarEventRepository calendarEventRepository, CitaRepository citaRepository) {
        this.calendarEventRepository = calendarEventRepository;
        this.citaRepository = citaRepository;
    }

    @Transactional(readOnly = true)
    public List<CalendarEventResponse> verCalendarioAdmin(LocalDateTime desde, LocalDateTime hasta) {
        validarRango(desde, hasta);

        List<CalendarEventResponse> citas = citaRepository.buscarPorRango(desde, hasta)
                .stream()
                .map(this::toCalendarResponse)
                .toList();

        List<CalendarEventResponse> eventos = calendarEventRepository.buscarPorRango(desde, hasta)
                .stream()
                .map(this::toCalendarResponse)
                .toList();

        return Stream.concat(citas.stream(), eventos.stream())
                .sorted(Comparator.comparing(CalendarEventResponse::inicio))
                .toList();
    }

    private void validarRango(LocalDateTime inicio, LocalDateTime fin) {
        if (!fin.isAfter(inicio)) {
            throw new ConflictoException("La fecha y hora de fin debe ser posterior al inicio");
        }
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