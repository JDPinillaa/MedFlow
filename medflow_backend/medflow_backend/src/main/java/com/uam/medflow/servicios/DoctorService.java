package com.uam.medflow.servicios;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uam.medflow.dto.doctor.DoctorRequest;
import com.uam.medflow.dto.doctor.DoctorResponse;
import com.uam.medflow.entidades.Doctor;
import com.uam.medflow.excepciones.ConflictoException;
import com.uam.medflow.excepciones.RecursoNoEncontradoException;
import com.uam.medflow.repositorios.DoctorRepository;

@Service
@Transactional
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> listar(String busqueda) {
        List<Doctor> doctores = (busqueda == null || busqueda.isBlank())
                ? doctorRepository.findAllByOrderByNombreCompletoAsc()
                : doctorRepository.buscar(busqueda.trim());

        return doctores.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DoctorResponse obtenerPorId(Integer id) {
        return toResponse(buscarEntidad(id));
    }

    public DoctorResponse crear(DoctorRequest request) {
        validarDuplicados(request, null);
        Doctor doctor = new Doctor();
        aplicarCambios(doctor, request);
        return toResponse(doctorRepository.save(doctor));
    }

    public DoctorResponse actualizar(Integer id, DoctorRequest request) {
        Doctor doctor = buscarEntidad(id);
        validarDuplicados(request, id);
        aplicarCambios(doctor, request);
        return toResponse(doctorRepository.save(doctor));
    }

    public void eliminar(Integer id) {
        doctorRepository.delete(buscarEntidad(id));
    }

    public Doctor buscarEntidad(Integer id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Doctor no encontrado con id " + id));
    }

    private void validarDuplicados(DoctorRequest request, Integer id) {
        String registroMedico = normalizarTexto(request.registroMedico());
        String email = normalizarEmail(request.email());

        boolean registroDuplicado = id == null
                ? doctorRepository.existsByRegistroMedicoIgnoreCase(registroMedico)
                : doctorRepository.existsByRegistroMedicoIgnoreCaseAndIdNot(registroMedico, id);
        if (registroDuplicado) {
            throw new ConflictoException("Ya existe un doctor con el registro medico " + registroMedico);
        }

        boolean emailDuplicado = id == null
                ? doctorRepository.existsByEmailIgnoreCase(email)
                : doctorRepository.existsByEmailIgnoreCaseAndIdNot(email, id);
        if (emailDuplicado) {
            throw new ConflictoException("El correo " + email + " ya esta en uso");
        }
    }

    private void aplicarCambios(Doctor doctor, DoctorRequest request) {
        doctor.setNombreCompleto(normalizarTexto(request.nombreCompleto()));
        doctor.setEspecialidad(normalizarTexto(request.especialidad()));
        doctor.setRegistroMedico(normalizarTexto(request.registroMedico()));
        doctor.setEmail(normalizarEmail(request.email()));
    }

    private String normalizarTexto(String valor) {
        return valor.trim();
    }

    private String normalizarEmail(String email) {
        return normalizarTexto(email).toLowerCase(Locale.ROOT);
    }

    private DoctorResponse toResponse(Doctor doctor) {
        return new DoctorResponse(
                doctor.getId(),
                doctor.getNombreCompleto(),
                doctor.getEspecialidad(),
                doctor.getRegistroMedico(),
                doctor.getEmail());
    }
}
