package com.uam.medflow.controladores;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.uam.medflow.dto.cita.CitaRequest;
import com.uam.medflow.dto.cita.CitaResponse;
import com.uam.medflow.servicios.CitaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/citas")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    @GetMapping
    public List<CitaResponse> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam(required = false) Integer pacienteId) {
        return citaService.listar(fecha, pacienteId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CitaResponse crear(@Valid @RequestBody CitaRequest request) {
        return citaService.crear(request);
    }

    @GetMapping("/{id}")
    public CitaResponse obtenerPorId(@PathVariable Integer id) {
        return citaService.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    public CitaResponse actualizar(@PathVariable Integer id, @Valid @RequestBody CitaRequest request) {
        return citaService.actualizar(id, request);
    }

    @PatchMapping("/{id}/cancelar")
    public CitaResponse cancelar(@PathVariable Integer id) {
        return citaService.cancelar(id);
    }
}
