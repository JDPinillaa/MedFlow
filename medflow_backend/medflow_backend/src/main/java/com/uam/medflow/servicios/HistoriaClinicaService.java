package com.uam.medflow.servicios;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uam.medflow.dto.historia.HistoriaClinicaRequest;
import com.uam.medflow.dto.historia.HistoriaClinicaResponse;
import com.uam.medflow.entidades.Cita;
import com.uam.medflow.entidades.HistoriaClinica;
import com.uam.medflow.excepciones.ConflictoException;
import com.uam.medflow.excepciones.RecursoNoEncontradoException;
import com.uam.medflow.repositorios.HistoriaClinicaRepository;

@Service
@Transactional
public class HistoriaClinicaService {

    private static final String ESTADO_CANCELADA = "CANCELADA";
    private static final String ESTADO_COMPLETADA = "COMPLETADA";

    private final HistoriaClinicaRepository historiaClinicaRepository;
    private final CitaService citaService;
    private final PacienteService pacienteService;

    public HistoriaClinicaService(
            HistoriaClinicaRepository historiaClinicaRepository,
            CitaService citaService,
            PacienteService pacienteService) {
        this.historiaClinicaRepository = historiaClinicaRepository;
        this.citaService = citaService;
        this.pacienteService = pacienteService;
    }

    @Transactional(readOnly = true)
    public List<HistoriaClinicaResponse> listar() {
        return historiaClinicaRepository.findAllConRelaciones()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public HistoriaClinicaResponse obtenerPorId(Integer id) {
        return toResponse(buscarEntidad(id));
    }

    @Transactional(readOnly = true)
    public List<HistoriaClinicaResponse> listarPorPaciente(Integer pacienteId) {
        pacienteService.buscarEntidad(pacienteId);

        return historiaClinicaRepository.findByPacienteConRelaciones(pacienteId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public HistoriaClinicaResponse crear(HistoriaClinicaRequest request) {
        Cita cita = citaService.buscarEntidad(request.citaId());

        if (historiaClinicaRepository.existsByCitaId(request.citaId())) {
            throw new ConflictoException("La cita ya tiene una historia clinica registrada");
        }

        if (ESTADO_CANCELADA.equalsIgnoreCase(cita.getEstado())) {
            throw new ConflictoException("No se puede crear historia clinica para una cita cancelada");
        }

        HistoriaClinica historiaClinica = new HistoriaClinica();
        historiaClinica.setCita(cita);
        historiaClinica.setPaciente(cita.getPaciente());
        historiaClinica.setDoctor(cita.getDoctor());
        historiaClinica.setObservaciones(request.observaciones().trim());
        historiaClinica.setFechaRegistro(LocalDateTime.now());

        cita.setEstado(ESTADO_COMPLETADA);

        return toResponse(historiaClinicaRepository.save(historiaClinica));
    }

    public HistoriaClinicaResponse actualizar(Integer id, HistoriaClinicaRequest request) {
        HistoriaClinica historiaClinica = buscarEntidad(id);

        if (!historiaClinica.getCita().getId().equals(request.citaId())) {
            throw new ConflictoException("No se puede cambiar la cita asociada a una historia clinica");
        }

        historiaClinica.setObservaciones(request.observaciones().trim());

        return toResponse(historiaClinicaRepository.save(historiaClinica));
    }

    private HistoriaClinica buscarEntidad(Integer id) {
        return historiaClinicaRepository.findConRelacionesById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Historia clinica no encontrada con id " + id));
    }

    private HistoriaClinicaResponse toResponse(HistoriaClinica historiaClinica) {
        Cita cita = historiaClinica.getCita();

        return new HistoriaClinicaResponse(
                historiaClinica.getId(),
                historiaClinica.getFechaRegistro(),
                historiaClinica.getObservaciones(),
                cita.getId(),
                cita.getFechaHora(),
                cita.getEstado(),
                historiaClinica.getPaciente().getId(),
                historiaClinica.getPaciente().getNombreCompleto(),
                historiaClinica.getDoctor().getId(),
                historiaClinica.getDoctor().getNombreCompleto(),
                historiaClinica.getDoctor().getEspecialidad(),
                cita.getProcedimiento().getId(),
                cita.getProcedimiento().getNombre());
    }
}
