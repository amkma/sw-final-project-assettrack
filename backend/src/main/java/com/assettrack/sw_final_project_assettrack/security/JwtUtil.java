package com.assettrack.sw_final_project_assettrack.security;

import com.assettrack.sw_final_project_assettrack.entity.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final String secret;
    private final JWTVerifier verifier;
    private final long expiryHours = 1;

    public JwtUtil(@Value("${JWT_SECRET:}") String secret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET environment variable is required");
        }

        this.secret = secret;
        this.verifier = JWT.require(Algorithm.HMAC256(secret)).build();
    }

    public String generateToken(User user) {
        return generateToken(user.getId(), AppRole.fromId(user.getRoleId()).name());
    }

    public String generateToken(Long userId, String role) {
        Instant now = Instant.now();
        Date exp = Date.from(now.plus(expiryHours, ChronoUnit.HOURS));

        return JWT.create()
                .withClaim("userId", userId)
                .withClaim("role", role)
                .withIssuedAt(Date.from(now))
                .withExpiresAt(exp)
                .sign(Algorithm.HMAC256(secret));
    }

    public boolean validateToken(String token) {
        try {
            verifier.verify(token);
            return true;
        } catch (JWTVerificationException ex) {
            return false;
        }
    }

    public Long getUserIdFromToken(String token) {
        return decode(token).getClaim("userId").asLong();
    }

    public String getRoleFromToken(String token) {
        return decode(token).getClaim("role").asString();
    }

    private DecodedJWT decode(String token) {
        return verifier.verify(token);
    }
}
