package com.uam.medflow.controladores;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.uam.medflow.dto.historia.HistoriaClinicaRequest;
import com.uam.medflow.dto.historia.HistoriaClinicaResponse;
import com.uam.medflow.servicios.HistoriaClinicaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/historias-clinicas")
public class HistoriaClinicaController {

    private final HistoriaClinicaService historiaClinicaService;

    public HistoriaClinicaController(HistoriaClinicaService historiaClinicaService) {
        this.historiaClinicaService = historiaClinicaService;
    }

    @GetMapping
    public List<HistoriaClinicaResponse> listar() {
        return historiaClinicaService.listar();
    }

    @GetMapping("/{id}")
    public HistoriaClinicaResponse obtenerPorId(@PathVariable Integer id) {
        return historiaClinicaService.obtenerPorId(id);
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<HistoriaClinicaResponse> listarPorPaciente(@PathVariable Integer pacienteId) {
        return historiaClinicaService.listarPorPaciente(pacienteId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HistoriaClinicaResponse crear(@Valid @RequestBody HistoriaClinicaRequest request) {
        return historiaClinicaService.crear(request);
    }

    @PutMapping("/{id}")
    public HistoriaClinicaResponse actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody HistoriaClinicaRequest request) {
        return historiaClinicaService.actualizar(id, request);
    }
}
