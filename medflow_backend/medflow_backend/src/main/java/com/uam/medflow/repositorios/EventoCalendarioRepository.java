package com.uam.medflow.repositorios;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uam.medflow.entidades.EventoCalendario;

public interface EventoCalendarioRepository extends JpaRepository<EventoCalendario, Integer> {

    @Query("""
            select e
            from EventoCalendario e
            join fetch e.doctor
            where e.doctor.id = :doctorId
              and e.inicio < :hasta
              and e.fin > :desde
            order by e.inicio asc
            """)
    List<EventoCalendario> buscarPorDoctorYRango(
            @Param("doctorId") Integer doctorId,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta);

    @Query("""
            select count(e) > 0
            from EventoCalendario e
            where e.doctor.id = :doctorId
              and e.inicio < :fin
              and e.fin > :inicio
            """)
    boolean existeCruceEvento(
            @Param("doctorId") Integer doctorId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin);
}
