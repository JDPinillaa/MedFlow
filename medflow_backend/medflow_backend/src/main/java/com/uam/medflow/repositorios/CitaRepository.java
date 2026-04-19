package com.uam.medflow.repositorios;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uam.medflow.entidades.Cita;

public interface CitaRepository extends JpaRepository<Cita, Integer> {

    @Query("""
            select c
            from Cita c
            join fetch c.paciente
            join fetch c.doctor
            join fetch c.procedimiento
            order by c.fechaHora asc
            """)
    List<Cita> findAllConRelaciones();

    @Query("""
            select c
            from Cita c
            join fetch c.paciente
            join fetch c.doctor
            join fetch c.procedimiento
            where c.id = :id
            """)
    java.util.Optional<Cita> findConRelacionesById(@Param("id") Integer id);

    @Query("""
            select c
            from Cita c
            join fetch c.paciente
            join fetch c.doctor
            join fetch c.procedimiento
            where (:fecha is null or function('date', c.fechaHora) = :fecha)
            order by c.fechaHora asc
            """)
    List<Cita> buscarPorFecha(@Param("fecha") LocalDate fecha);

    @Query("""
            select count(c) > 0
            from Cita c
            where c.doctor.id = :doctorId
              and c.fechaHora = :fechaHora
              and upper(c.estado) <> 'CANCELADA'
              and (:citaId is null or c.id <> :citaId)
            """)
    boolean existeCruceDoctor(
            @Param("doctorId") Integer doctorId,
            @Param("fechaHora") LocalDateTime fechaHora,
            @Param("citaId") Integer citaId);

    @Query("""
            select count(c) > 0
            from Cita c
            where c.paciente.id = :pacienteId
              and c.fechaHora = :fechaHora
              and upper(c.estado) <> 'CANCELADA'
              and (:citaId is null or c.id <> :citaId)
            """)
    boolean existeCrucePaciente(
            @Param("pacienteId") Integer pacienteId,
            @Param("fechaHora") LocalDateTime fechaHora,
            @Param("citaId") Integer citaId);
}
