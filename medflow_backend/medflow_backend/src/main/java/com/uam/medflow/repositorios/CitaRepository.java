package com.uam.medflow.repositorios;

import com.uam.medflow.entidades.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer> {

    @Query("""
            select c
            from Cita c
            join fetch c.paciente
            join fetch c.doctor
            join fetch c.procedimiento
            where c.id = :id
            """)
    Optional<Cita> findConRelacionesById(@Param("id") Integer id);

    @Query("""
            select c
            from Cita c
            join fetch c.paciente
            join fetch c.doctor
            join fetch c.procedimiento
            order by c.fechaHora asc
            """)
    List<Cita> findAllConRelaciones();

    /**
     * Lista citas filtrando opcionalmente por fecha y/o paciente.
     * Si ambos parámetros son null, retorna todas las citas.
     */
    @Query("""
            select c
            from Cita c
            join fetch c.paciente
            join fetch c.doctor
            join fetch c.procedimiento
            where (:fecha is null or function('date', c.fechaHora) = :fecha)
              and (:pacienteId is null or c.paciente.id = :pacienteId)
            order by c.fechaHora asc
            """)
    List<Cita> buscarPorFiltros(
            @Param("fecha") LocalDate fecha,
            @Param("pacienteId") Integer pacienteId);

    @Query("""
            select c
            from Cita c
            join fetch c.paciente
            join fetch c.doctor
            join fetch c.procedimiento
            where c.doctor.id = :doctorId
              and c.fechaHora >= :desde
              and c.fechaHora < :hasta
            order by c.fechaHora asc
            """)
    List<Cita> buscarPorDoctorYRango(
            @Param("doctorId") Integer doctorId,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta);

    @Query("""
            select c
            from Cita c
            join fetch c.paciente
            join fetch c.doctor
            join fetch c.procedimiento
            where c.doctor.id = :doctorId
              and c.fechaHora >= :desdeBusqueda
              and c.fechaHora < :fin
              and upper(c.estado) <> 'CANCELADA'
            order by c.fechaHora asc
            """)
    List<Cita> buscarCitasActivasParaCruceCalendario(
            @Param("doctorId") Integer doctorId,
            @Param("desdeBusqueda") LocalDateTime desdeBusqueda,
            @Param("fin") LocalDateTime fin);

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