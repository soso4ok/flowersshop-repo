package com.example.flowersproject.exceptions;

public class JwtSignatureException extends RuntimeException{

    public JwtSignatureException(String message, Throwable cause) {
        super(message, cause);
    }

}
