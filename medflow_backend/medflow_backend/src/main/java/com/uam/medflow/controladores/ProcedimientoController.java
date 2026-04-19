package com.uam.medflow.controladores;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.uam.medflow.dto.procedimiento.ProcedimientoRequest;
import com.uam.medflow.dto.procedimiento.ProcedimientoResponse;
import com.uam.medflow.servicios.ProcedimientoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/procedimientos")
public class ProcedimientoController {

    private final ProcedimientoService procedimientoService;

    public ProcedimientoController(ProcedimientoService procedimientoService) {
        this.procedimientoService = procedimientoService;
    }

    @GetMapping
    public List<ProcedimientoResponse> listar(@RequestParam(required = false) String busqueda) {
        return procedimientoService.listar(busqueda);
    }

    @GetMapping("/{id}")
    public ProcedimientoResponse obtenerPorId(@PathVariable Integer id) {
        return procedimientoService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProcedimientoResponse crear(@Valid @RequestBody ProcedimientoRequest request) {
        return procedimientoService.crear(request);
    }

    @PutMapping("/{id}")
    public ProcedimientoResponse actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ProcedimientoRequest request) {
        return procedimientoService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        procedimientoService.eliminar(id);
    }
}
