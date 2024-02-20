package com.example.flowersproject.rest.exceptions;

public class ProductNotFoundException extends ApiException{

    public ProductNotFoundException(String message, String errorCode) {
        super(message, errorCode);
    }
}
