package com.example.flowersproject.exceptions;

public class ApiException extends RuntimeException {

    protected String errorCode;

    public ApiException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

}
