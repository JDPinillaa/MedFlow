package com.uam.medflow.servicios;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uam.medflow.dto.paciente.PacienteRequest;
import com.uam.medflow.dto.paciente.PacienteResponse;
import com.uam.medflow.entidades.Paciente;
import com.uam.medflow.excepciones.ConflictoException;
import com.uam.medflow.excepciones.RecursoNoEncontradoException;
import com.uam.medflow.repositorios.PacienteRepository;

@Service
@Transactional
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    public PacienteService(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    @Transactional(readOnly = true)
    public List<PacienteResponse> listar(String busqueda) {
        List<Paciente> pacientes = (busqueda == null || busqueda.isBlank())
                ? pacienteRepository.findAllByOrderByNombreCompletoAsc()
                : pacienteRepository.buscar(busqueda.trim());

        return pacientes.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PacienteResponse obtenerPorId(Integer id) {
        return toResponse(buscarEntidad(id));
    }

    public PacienteResponse crear(PacienteRequest request) {
        validarDuplicados(request, null);

        Paciente paciente = new Paciente();
        aplicarCambios(paciente, request);

        return toResponse(pacienteRepository.save(paciente));
    }

    public PacienteResponse actualizar(Integer id, PacienteRequest request) {
        Paciente paciente = buscarEntidad(id);
        validarDuplicados(request, id);
        aplicarCambios(paciente, request);

        return toResponse(pacienteRepository.save(paciente));
    }

    public void eliminar(Integer id) {
        Paciente paciente = buscarEntidad(id);
        pacienteRepository.delete(paciente);
    }

    private Paciente buscarEntidad(Integer id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Paciente no encontrado con id " + id));
    }

    private void validarDuplicados(PacienteRequest request, Integer id) {
        boolean documentoDuplicado = id == null
                ? pacienteRepository.existsByDocumentoIgnoreCase(request.documento())
                : pacienteRepository.existsByDocumentoIgnoreCaseAndIdNot(request.documento(), id);

        if (documentoDuplicado) {
            throw new ConflictoException("Ya existe un paciente con el documento " + request.documento());
        }

        boolean emailDuplicado = id == null
                ? pacienteRepository.existsByEmailIgnoreCase(request.email())
                : pacienteRepository.existsByEmailIgnoreCaseAndIdNot(request.email(), id);

        if (emailDuplicado) {
            throw new ConflictoException("Ya existe un paciente con el email " + request.email());
        }
    }

    private void aplicarCambios(Paciente paciente, PacienteRequest request) {
        paciente.setNombreCompleto(request.nombreCompleto().trim());
        paciente.setDocumento(request.documento().trim());
        paciente.setTelefono(request.telefono().trim());
        paciente.setEmail(request.email().trim().toLowerCase());
        paciente.setDireccion(request.direccion().trim());
    }

    private PacienteResponse toResponse(Paciente paciente) {
        return new PacienteResponse(
                paciente.getId(),
                paciente.getNombreCompleto(),
                paciente.getDocumento(),
                paciente.getTelefono(),
                paciente.getEmail(),
                paciente.getDireccion());
    }
}
