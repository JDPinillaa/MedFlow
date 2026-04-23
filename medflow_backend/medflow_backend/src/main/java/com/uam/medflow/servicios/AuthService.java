package com.uam.medflow.servicios;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.uam.medflow.dto.auth.LoginRequest;
import com.uam.medflow.dto.auth.LoginResponse;
import com.uam.medflow.entidades.Usuario;
import com.uam.medflow.excepciones.RecursoNoEncontradoException;
import com.uam.medflow.repositorios.UsuarioRepository;
import com.uam.medflow.seguridad.JwtService;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new RecursoNoEncontradoException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new RecursoNoEncontradoException("Credenciales inválidas");
        }

        String token = jwtService.generarToken(usuario);

        return new LoginResponse(token, usuario.getId(), usuario.getEmail(), usuario.getRol());
    }
}