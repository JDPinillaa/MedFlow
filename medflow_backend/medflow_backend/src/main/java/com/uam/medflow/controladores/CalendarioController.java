package com.uam.medflow.controladores;

import com.uam.medflow.dto.calendario.CalendarEventRequest;
import com.uam.medflow.dto.calendario.CalendarEventResponse;
import com.uam.medflow.servicios.CalendarioService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/calendario")
public class CalendarioController {

    private final CalendarioService calendarioService;

    public CalendarioController(CalendarioService calendarioService) {
        this.calendarioService = calendarioService;
    }

    @GetMapping("/admin")
    public ResponseEntity<List<CalendarEventResponse>> obtenerCalendarioAdmin(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        return ResponseEntity.ok(calendarioService.verCalendarioAdmin(desde, hasta));
    }

    @PostMapping("/eventos")
    public ResponseEntity<CalendarEventResponse> crearEvento(@Valid @RequestBody CalendarEventRequest request) {
        return new ResponseEntity<>(calendarioService.crearEvento(request), HttpStatus.CREATED);
    }



    public List<CalendarEventResponse> verCalendario(Integer doctorId, LocalDateTime desde, LocalDateTime hasta) {
        List<Cita> citas = citaRepository.buscarPorDoctorYRango(doctorId, desde, hasta);

        List<CalendarEventResponse> respuesta = citas.stream().map(cita -> new CalendarEventResponse(
                cita.getId(),
                "CITA",
                "Cita: " + cita.getPaciente().getNombre(),
                "Procedimiento: " + cita.getProcedimiento().getNombre(),
                cita.getFechaHora(),
                cita.getFechaHora().plusMinutes(30),
                cita.getEstado().toString(),
                cita.getDoctor().getId(),
                cita.getDoctor().getNombre(),
                cita.getPaciente().getId(),
                cita.getPaciente().getNombre(),
                cita.getId(),
                null,
                cita.getProcedimiento().getId(),
                cita.getProcedimiento().getNombre()
        )).collect(Collectors.toCollection(ArrayList::new));

        respuesta.add(new CalendarEventResponse(
                999,
                "EVENTO",
                "Reunión Staff",
                "Reunión administrativa",
                desde.plusHours(2),
                desde.plusHours(3),
                "PROGRAMADO",
                doctorId,
                "Sistema",
                null, null, null, 1, null, null
        ));

        return respuesta;
    }

    public CalendarEventResponse crearEvento(CalendarEventRequest request) {
        return null;
    }
}