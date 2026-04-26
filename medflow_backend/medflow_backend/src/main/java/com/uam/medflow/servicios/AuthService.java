package com.uam.medflow.servicios;

import com.uam.medflow.dto.auth.LoginRequest;
import com.uam.medflow.dto.auth.LoginResponse;
import com.uam.medflow.entidades.Usuario;
import com.uam.medflow.excepciones.CredencialesInvalidasException;
import com.uam.medflow.repositorios.UsuarioRepository;
import com.uam.medflow.seguridad.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UsuarioRepository usuarioRepository,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (BadCredentialsException ex) {
            throw new CredencialesInvalidasException("Credenciales invalidas");
        }

        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new CredencialesInvalidasException("Credenciales invalidas"));

        String token = jwtService.generarToken(usuario);

        return new LoginResponse(token, usuario.getId(), usuario.getEmail(), usuario.getRol().name());
    }
}
