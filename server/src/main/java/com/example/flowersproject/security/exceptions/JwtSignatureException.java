package com.example.flowersproject.security.exceptions;

public class JwtSignatureException extends RuntimeException{

    public JwtSignatureException(String message, Throwable cause) {
        super(message, cause);
    }

}
