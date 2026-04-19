package com.uam.medflow.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uam.medflow.entidades.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {

    boolean existsByRegistroMedicoIgnoreCase(String registroMedico);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByRegistroMedicoIgnoreCaseAndIdNot(String registroMedico, Integer id);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Integer id);

    List<Doctor> findAllByOrderByNombreCompletoAsc();

    @Query("""
            select d
            from Doctor d
            where lower(d.nombreCompleto) like lower(concat('%', :termino, '%'))
               or lower(d.especialidad) like lower(concat('%', :termino, '%'))
               or lower(d.registroMedico) like lower(concat('%', :termino, '%'))
            order by d.nombreCompleto asc
            """)
    List<Doctor> buscar(@Param("termino") String termino);
}
