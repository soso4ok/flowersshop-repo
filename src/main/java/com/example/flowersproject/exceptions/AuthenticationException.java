package com.example.flowersproject.exceptions;

public class AuthenticationException extends ApiException {
    public AuthenticationException(String message, String errorCode) {
        super(message, errorCode);
    }
}
