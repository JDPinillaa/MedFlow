package com.uam.medflow.controladores;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.uam.medflow.dto.calendario.EventoCalendarioRequest;
import com.uam.medflow.dto.calendario.EventoCalendarioResponse;
import com.uam.medflow.servicios.CalendarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/calendario")
public class CalendarioController {

    private final CalendarioService calendarioService;

    public CalendarioController(CalendarioService calendarioService) {
        this.calendarioService = calendarioService;
    }

    @GetMapping
    public List<EventoCalendarioResponse> verCalendario(
            @RequestParam Integer doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        return calendarioService.verCalendario(doctorId, desde, hasta);
    }

    @PostMapping("/eventos")
    @ResponseStatus(HttpStatus.CREATED)
    public EventoCalendarioResponse crearEvento(@Valid @RequestBody EventoCalendarioRequest request) {
        return calendarioService.crearEvento(request);
    }
}
