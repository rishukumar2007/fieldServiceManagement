package com.KEYSTONE.fieldServiceManagement.Security;

import com.KEYSTONE.fieldServiceManagement.Enum.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // 256-bit secret key for HMAC-SHA256 JWT signing
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(
            "KeystoneFieldServiceManagementSecretKey2026SecurityTokenSignatureForZidioProject".getBytes()
    );

    private static final long EXPIRATION_TIME_MS = 86400000; // 24 hours

    public String generateToken(String email, Role role, Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME_MS);

        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .claim("role", role.name())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
