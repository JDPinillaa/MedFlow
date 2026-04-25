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
}