package com.assettrack.sw_final_project_assettrack.security;

import com.assettrack.sw_final_project_assettrack.entity.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final String secret;
    private final long expiryHours = 1; // 1 hour

    public JwtUtil() {
        String s = System.getenv("JWT_SECRET");
        this.secret = (s == null || s.isBlank()) ? "default-dev-secret" : s;
    }

    public String generateToken(User user) {
        String role = mapRole(user.getRoleId());
        Instant now = Instant.now();
        Date exp = Date.from(now.plus(expiryHours, ChronoUnit.HOURS));

        Algorithm alg = Algorithm.HMAC256(secret);
        return JWT.create()
                .withClaim("userId", user.getId())
                .withClaim("role", role)
                .withIssuedAt(Date.from(now))
                .withExpiresAt(exp)
                .sign(alg);
    }

    private String mapRole(long roleId) {
        if (roleId == 1) return "MANAGER";
        if (roleId == 2) return "ADMIN";
        return "USER";
    }
}
