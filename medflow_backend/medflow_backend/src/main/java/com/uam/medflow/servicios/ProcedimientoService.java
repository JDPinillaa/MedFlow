package com.uam.medflow.servicios;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uam.medflow.dto.procedimiento.ProcedimientoRequest;
import com.uam.medflow.dto.procedimiento.ProcedimientoResponse;
import com.uam.medflow.entidades.Procedimiento;
import com.uam.medflow.excepciones.ConflictoException;
import com.uam.medflow.excepciones.RecursoNoEncontradoException;
import com.uam.medflow.repositorios.ProcedimientoRepository;

@Service
@Transactional
public class ProcedimientoService {

    private final ProcedimientoRepository procedimientoRepository;

    public ProcedimientoService(ProcedimientoRepository procedimientoRepository) {
        this.procedimientoRepository = procedimientoRepository;
    }

    @Transactional(readOnly = true)
    public List<ProcedimientoResponse> listar(String busqueda) {
        List<Procedimiento> procedimientos = (busqueda == null || busqueda.isBlank())
                ? procedimientoRepository.findAllByOrderByNombreAsc()
                : procedimientoRepository.buscar(busqueda.trim());

        return procedimientos.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProcedimientoResponse obtenerPorId(Integer id) {
        return toResponse(buscarEntidad(id));
    }

    public ProcedimientoResponse crear(ProcedimientoRequest request) {
        validarNombre(request.nombre(), null);
        Procedimiento procedimiento = new Procedimiento();
        aplicarCambios(procedimiento, request);
        return toResponse(procedimientoRepository.save(procedimiento));
    }

    public ProcedimientoResponse actualizar(Integer id, ProcedimientoRequest request) {
        Procedimiento procedimiento = buscarEntidad(id);
        validarNombre(request.nombre(), id);
        aplicarCambios(procedimiento, request);
        return toResponse(procedimientoRepository.save(procedimiento));
    }

    public void eliminar(Integer id) {
        procedimientoRepository.delete(buscarEntidad(id));
    }

    public Procedimiento buscarEntidad(Integer id) {
        return procedimientoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Procedimiento no encontrado con id " + id));
    }

    private void validarNombre(String nombre, Integer id) {
        boolean duplicado = id == null
                ? procedimientoRepository.existsByNombreIgnoreCase(nombre)
                : procedimientoRepository.existsByNombreIgnoreCaseAndIdNot(nombre, id);

        if (duplicado) {
            throw new ConflictoException("Ya existe un procedimiento con el nombre " + nombre);
        }
    }

    private void aplicarCambios(Procedimiento procedimiento, ProcedimientoRequest request) {
        procedimiento.setNombre(request.nombre().trim());
        procedimiento.setPrecio(request.precio());
        procedimiento.setDuracionMinutos(request.duracionMinutos());
    }

    private ProcedimientoResponse toResponse(Procedimiento procedimiento) {
        return new ProcedimientoResponse(
                procedimiento.getId(),
                procedimiento.getNombre(),
                procedimiento.getPrecio(),
                procedimiento.getDuracionMinutos());
    }
}
