package com.example.flowersproject.security.exceptions;

import com.example.flowersproject.rest.exceptions.ApiException;

public class AuthenticationException extends ApiException {
    public AuthenticationException(String message, String errorCode) {
        super(message, errorCode);
    }
}
