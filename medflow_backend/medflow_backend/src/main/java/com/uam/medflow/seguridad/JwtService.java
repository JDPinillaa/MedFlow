package com.uam.medflow.seguridad;

import com.uam.medflow.entidades.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationTimeMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms:86400000}") long expirationTimeMs) {
        this.signingKey = buildSigningKey(secret);
        this.expirationTimeMs = expirationTimeMs;
    }

    public String generarToken(Usuario usuario) {
        Date ahora = new Date();

        return Jwts.builder()
                .claim("rol", usuario.getRol())
                .subject(usuario.getEmail())
                .issuedAt(ahora)
                .expiration(new Date(ahora.getTime() + expirationTimeMs))
                .signWith(signingKey)
                .compact();
    }

    public String extraerEmail(String token) {
        return extraerClaims(token).getSubject();
    }

    public String extraerRol(String token) {
        return extraerClaims(token).get("rol", String.class);
    }

    public boolean validarToken(String token) {
        try {
            return !estaExpirado(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean validarToken(String token, UserDetails userDetails) {
        try {
            String email = extraerEmail(token);
            return email.equalsIgnoreCase(userDetails.getUsername()) && !estaExpirado(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims extraerClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean estaExpirado(String token) {
        return extraerClaims(token).getExpiration().before(new Date());
    }

    private SecretKey buildSigningKey(String secret) {
        byte[] keyBytes = decodeSecret(secret);

        if (keyBytes.length < 32) {
            throw new IllegalStateException("La clave JWT debe tener al menos 32 bytes");
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    private byte[] decodeSecret(String secret) {
        try {
            return Decoders.BASE64.decode(secret);
        } catch (RuntimeException ignored) {
            return secret.getBytes(StandardCharsets.UTF_8);
        }
    }
}
