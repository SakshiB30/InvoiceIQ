
package security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtServiceTest {

    @Test
    void expiredTokenShouldBeRejected() {
        String testSecret =
                "InvoiceIQTestSecretKey12345678901234567890";

        SecretKey key = Keys.hmacShaKeyFor(
                testSecret.getBytes(StandardCharsets.UTF_8)
        );

        Date now = new Date();

        String expiredToken = Jwts.builder()
                .subject("expired-test@example.com")
                .issuedAt(new Date(now.getTime() - 120_000))
                .expiration(new Date(now.getTime() - 60_000))
                .signWith(key)
                .compact();

        assertThrows(
                ExpiredJwtException.class,
                () -> Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(expiredToken)
        );
    }
}
