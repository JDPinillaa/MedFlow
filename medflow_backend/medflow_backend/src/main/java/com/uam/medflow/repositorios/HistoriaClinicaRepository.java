package com.uam.medflow.repositorios;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uam.medflow.entidades.HistoriaClinica;

public interface HistoriaClinicaRepository extends JpaRepository<HistoriaClinica, Integer> {

    boolean existsByCitaId(Integer citaId);

    @Query("""
            select h
            from HistoriaClinica h
            join fetch h.paciente
            join fetch h.doctor
            join fetch h.cita c
            join fetch c.procedimiento
            where h.id = :id
            """)
    Optional<HistoriaClinica> findConRelacionesById(@Param("id") Integer id);

    @Query("""
            select h
            from HistoriaClinica h
            join fetch h.paciente
            join fetch h.doctor
            join fetch h.cita c
            join fetch c.procedimiento
            where h.paciente.id = :pacienteId
            order by h.fechaRegistro desc
            """)
    List<HistoriaClinica> findByPacienteConRelaciones(@Param("pacienteId") Integer pacienteId);

    @Query("""
            select h
            from HistoriaClinica h
            join fetch h.paciente
            join fetch h.doctor
            join fetch h.cita c
            join fetch c.procedimiento
            order by h.fechaRegistro desc
            """)
    List<HistoriaClinica> findAllConRelaciones();
}
