package com.uam.medflow.servicios;

import java.util.List;

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
        boolean registroDuplicado = id == null
                ? doctorRepository.existsByRegistroMedicoIgnoreCase(request.registroMedico())
                : doctorRepository.existsByRegistroMedicoIgnoreCaseAndIdNot(request.registroMedico(), id);
        if (registroDuplicado) {
            throw new ConflictoException("Ya existe un doctor con el registro medico " + request.registroMedico());
        }

        boolean emailDuplicado = id == null
                ? doctorRepository.existsByEmailIgnoreCase(request.email())
                : doctorRepository.existsByEmailIgnoreCaseAndIdNot(request.email(), id);
        if (emailDuplicado) {
            throw new ConflictoException("Ya existe un doctor con el email " + request.email());
        }
    }

    private void aplicarCambios(Doctor doctor, DoctorRequest request) {
        doctor.setNombreCompleto(request.nombreCompleto().trim());
        doctor.setEspecialidad(request.especialidad().trim());
        doctor.setRegistroMedico(request.registroMedico().trim());
        doctor.setEmail(request.email().trim().toLowerCase());
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
