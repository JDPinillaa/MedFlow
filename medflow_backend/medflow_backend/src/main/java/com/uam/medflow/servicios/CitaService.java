package com.uam.medflow.servicios;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uam.medflow.dto.cita.CitaRequest;
import com.uam.medflow.dto.cita.CitaResponse;
import com.uam.medflow.entidades.Cita;
import com.uam.medflow.entidades.Doctor;
import com.uam.medflow.entidades.Paciente;
import com.uam.medflow.entidades.Procedimiento;
import com.uam.medflow.excepciones.ConflictoException;
import com.uam.medflow.excepciones.RecursoNoEncontradoException;
import com.uam.medflow.repositorios.CitaRepository;

@Service
@Transactional
public class CitaService {

    private static final String ESTADO_PROGRAMADA = "PROGRAMADA";
    private static final String ESTADO_COMPLETADA = "COMPLETADA";
    private static final String ESTADO_CANCELADA = "CANCELADA";

    private final CitaRepository citaRepository;
    private final PacienteService pacienteService;
    private final DoctorService doctorService;
    private final ProcedimientoService procedimientoService;

    public CitaService(
            CitaRepository citaRepository,
            PacienteService pacienteService,
            DoctorService doctorService,
            ProcedimientoService procedimientoService) {
        this.citaRepository = citaRepository;
        this.pacienteService = pacienteService;
        this.doctorService = doctorService;
        this.procedimientoService = procedimientoService;
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> listar(LocalDate fecha, Integer pacienteId) {
        if (pacienteId != null) {
            pacienteService.buscarEntidad(pacienteId);
        }

        return citaRepository.buscarPorFiltros(fecha, pacienteId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CitaResponse obtenerPorId(Integer id) {
        return toResponse(buscarEntidad(id));
    }

    public CitaResponse crear(CitaRequest request) {
        validarEstado(request.estado());
        validarDisponibilidad(request, null);

        Paciente paciente = pacienteService.buscarEntidad(request.pacienteId());
        Doctor doctor = doctorService.buscarEntidad(request.doctorId());
        Procedimiento procedimiento = procedimientoService.buscarEntidad(request.procedimientoId());

        Cita cita = new Cita();
        cita.setPaciente(paciente);
        cita.setDoctor(doctor);
        cita.setProcedimiento(procedimiento);
        cita.setFechaHora(request.fechaHora());
        cita.setEstado(normalizarEstado(request.estado()));

        return toResponse(citaRepository.save(cita));
    }

    public CitaResponse actualizar(Integer id, CitaRequest request) {
        Cita cita = buscarEntidad(id);
        validarEstado(request.estado());
        validarDisponibilidad(request, id);

        Paciente paciente = pacienteService.buscarEntidad(request.pacienteId());
        Doctor doctor = doctorService.buscarEntidad(request.doctorId());
        Procedimiento procedimiento = procedimientoService.buscarEntidad(request.procedimientoId());

        cita.setPaciente(paciente);
        cita.setDoctor(doctor);
        cita.setProcedimiento(procedimiento);
        cita.setFechaHora(request.fechaHora());
        cita.setEstado(normalizarEstado(request.estado()));

        return toResponse(citaRepository.save(cita));
    }

    public CitaResponse cancelar(Integer id) {
        Cita cita = buscarEntidad(id);
        cita.setEstado(ESTADO_CANCELADA);
        return toResponse(citaRepository.save(cita));
    }

    public Cita buscarEntidad(Integer id) {
        return citaRepository.findConRelacionesById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cita no encontrada con id " + id));
    }

    private void validarDisponibilidad(CitaRequest request, Integer citaId) {
        pacienteService.buscarEntidad(request.pacienteId());
        doctorService.buscarEntidad(request.doctorId());
        procedimientoService.buscarEntidad(request.procedimientoId());

        if (citaRepository.existeCruceDoctor(request.doctorId(), request.fechaHora(), citaId)) {
            throw new ConflictoException("El doctor ya tiene una cita programada en esa fecha y hora");
        }

        if (citaRepository.existeCrucePaciente(request.pacienteId(), request.fechaHora(), citaId)) {
            throw new ConflictoException("El paciente ya tiene una cita programada en esa fecha y hora");
        }
    }

    private void validarEstado(String estado) {
        if (estado == null || estado.isBlank()) {
            return;
        }

        String normalizado = estado.trim().toUpperCase();
        if (!ESTADO_PROGRAMADA.equals(normalizado)
                && !ESTADO_COMPLETADA.equals(normalizado)
                && !ESTADO_CANCELADA.equals(normalizado)) {
            throw new ConflictoException("El estado de la cita no es valido");
        }
    }

    private String normalizarEstado(String estado) {
        if (estado == null || estado.isBlank()) {
            return ESTADO_PROGRAMADA;
        }

        return estado.trim().toUpperCase();
    }

    private CitaResponse toResponse(Cita cita) {
        return new CitaResponse(
                cita.getId(),
                cita.getFechaHora(),
                cita.getEstado(),
                cita.getPaciente().getId(),
                cita.getPaciente().getNombreCompleto(),
                cita.getDoctor().getId(),
                cita.getDoctor().getNombreCompleto(),
                cita.getDoctor().getEspecialidad(),
                cita.getProcedimiento().getId(),
                cita.getProcedimiento().getNombre(),
                cita.getProcedimiento().getDuracionMinutos());
    }
}
