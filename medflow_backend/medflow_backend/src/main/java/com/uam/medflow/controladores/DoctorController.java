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

import com.uam.medflow.dto.doctor.DoctorRequest;
import com.uam.medflow.dto.doctor.DoctorResponse;
import com.uam.medflow.dto.doctor.DoctorUpdateResponse;
import com.uam.medflow.servicios.DoctorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/doctores")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public List<DoctorResponse> listar(@RequestParam(required = false) String busqueda) {
        return doctorService.listar(busqueda);
    }

    @GetMapping("/{id}")
    public DoctorResponse obtenerPorId(@PathVariable Integer id) {
        return doctorService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DoctorResponse crear(@Valid @RequestBody DoctorRequest request) {
        return doctorService.crear(request);
    }

    @PutMapping("/{id}")
    public DoctorUpdateResponse actualizar(@PathVariable Integer id, @Valid @RequestBody DoctorRequest request) {
        DoctorResponse doctorActualizado = doctorService.actualizar(id, request);
        return new DoctorUpdateResponse("Doctor actualizado correctamente", doctorActualizado);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        doctorService.eliminar(id);
    }
}
