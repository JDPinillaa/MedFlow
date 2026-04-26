package com.uam.medflow.seguridad;

import com.uam.medflow.entidades.Usuario;
import com.uam.medflow.repositorios.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioSecurityService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioSecurityService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email " + username));

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()))
                .build();
    }

    public Usuario obtenerPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email " + email));
    }
}
