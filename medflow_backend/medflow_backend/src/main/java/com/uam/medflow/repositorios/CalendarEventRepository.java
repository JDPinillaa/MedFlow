package com.uam.medflow.repositorios;

import com.uam.medflow.entidades.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Integer> {

    @Query("""
            select e
            from CalendarEvent e
            join fetch e.doctor
            where e.inicio < :hasta
              and e.fin > :desde
            order by e.inicio asc
            """)
    List<CalendarEvent> buscarPorRango(
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta);

    @Query("""
            select e
            from CalendarEvent e
            join fetch e.doctor
            where e.doctor.id = :doctorId
              and e.inicio < :hasta
              and e.fin > :desde
            order by e.inicio asc
            """)
    List<CalendarEvent> buscarPorDoctorYRango(
            @Param("doctorId") Integer doctorId,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta);

    @Query("""
            select count(e) > 0
            from CalendarEvent e
            where e.doctor.id = :doctorId
              and e.inicio < :fin
              and e.fin > :inicio
            """)
    boolean existeCruceEvento(
            @Param("doctorId") Integer doctorId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin);
}