package com.uam.medflow.repositorios;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.uam.medflow.entidades.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Método clave para el login: busca al usuario por su correo
    Optional<Usuario> findByEmail(String email);
}