package com.uam.medflow.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uam.medflow.entidades.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, Integer> {

    boolean existsByDocumentoIgnoreCase(String documento);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByDocumentoIgnoreCaseAndIdNot(String documento, Integer id);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Integer id);

    List<Paciente> findAllByOrderByNombreCompletoAsc();

    @Query("""
            select p
            from Paciente p
            where lower(p.nombreCompleto) like lower(concat('%', :termino, '%'))
               or lower(p.documento) like lower(concat('%', :termino, '%'))
               or lower(p.email) like lower(concat('%', :termino, '%'))
            order by p.nombreCompleto asc
            """)
    List<Paciente> buscar(@Param("termino") String termino);
}
