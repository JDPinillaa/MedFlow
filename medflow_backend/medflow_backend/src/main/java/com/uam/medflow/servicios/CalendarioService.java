package com.uam.medflow.servicios;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uam.medflow.dto.calendario.EventoCalendarioRequest;
import com.uam.medflow.dto.calendario.EventoCalendarioResponse;
import com.uam.medflow.entidades.Cita;
import com.uam.medflow.entidades.Doctor;
import com.uam.medflow.entidades.EventoCalendario;
import com.uam.medflow.excepciones.ConflictoException;
import com.uam.medflow.repositorios.CitaRepository;
import com.uam.medflow.repositorios.EventoCalendarioRepository;

@Service
@Transactional
public class CalendarioService {

    private static final String TIPO_CITA = "CITA";
    private static final String TIPO_EVENTO = "EVENTO";

    private final EventoCalendarioRepository eventoCalendarioRepository;
    private final CitaRepository citaRepository;
    private final DoctorService doctorService;

    public CalendarioService(
            EventoCalendarioRepository eventoCalendarioRepository,
            CitaRepository citaRepository,
            DoctorService doctorService) {
        this.eventoCalendarioRepository = eventoCalendarioRepository;
        this.citaRepository = citaRepository;
        this.doctorService = doctorService;
    }

    @Transactional(readOnly = true)
    public List<EventoCalendarioResponse> verCalendario(Integer doctorId, LocalDateTime desde, LocalDateTime hasta) {
        validarRango(desde, hasta);
        doctorService.buscarEntidad(doctorId);

        List<EventoCalendarioResponse> citas = citaRepository.buscarPorDoctorYRango(doctorId, desde, hasta)
                .stream()
                .map(this::aRespuestaEventoCalendario)
                .toList();

        List<EventoCalendarioResponse> eventos = eventoCalendarioRepository.buscarPorDoctorYRango(doctorId, desde, hasta)
                .stream()
                .map(this::aRespuestaEventoCalendario)
                .toList();

        return Stream.concat(citas.stream(), eventos.stream())
                .sorted(Comparator.comparing(EventoCalendarioResponse::inicio))
                .toList();
    }

    public EventoCalendarioResponse crearEvento(EventoCalendarioRequest request) {
        validarRango(request.inicio(), request.fin());

        Doctor doctor = doctorService.buscarEntidad(request.doctorId());

        if (eventoCalendarioRepository.existeCruceEvento(request.doctorId(), request.inicio(), request.fin())) {
            throw new ConflictoException("El doctor ya tiene un evento programado en ese rango de tiempo");
        }

        if (existeCruceConCita(request.doctorId(), request.inicio(), request.fin())) {
            throw new ConflictoException("El doctor ya tiene una cita programada en ese rango de tiempo");
        }

        EventoCalendario evento = new EventoCalendario();
        evento.setDoctor(doctor);
        evento.setTitulo(request.titulo().trim());
        evento.setDescripcion(request.descripcion() == null ? null : request.descripcion().trim());
        evento.setInicio(request.inicio());
        evento.setFin(request.fin());

        return aRespuestaEventoCalendario(eventoCalendarioRepository.save(evento));
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

    private EventoCalendarioResponse aRespuestaEventoCalendario(Cita cita) {
        LocalDateTime inicio = cita.getFechaHora();
        LocalDateTime fin = inicio.plusMinutes(cita.getProcedimiento().getDuracionMinutos());

        return new EventoCalendarioResponse(
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

    private EventoCalendarioResponse aRespuestaEventoCalendario(EventoCalendario evento) {
        return new EventoCalendarioResponse(
                evento.getId(),
                TIPO_EVENTO,
                evento.getTitulo(),
                evento.getDescripcion(),
                evento.getInicio(),
                evento.getFin(),
                null,
                evento.getDoctor().getId(),
                evento.getDoctor().getNombreCompleto(),
                null,
                null,
                null,
                evento.getId(),
                null,
                null);
    }
}
