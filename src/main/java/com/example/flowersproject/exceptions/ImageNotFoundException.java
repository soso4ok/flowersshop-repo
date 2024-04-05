package com.example.flowersproject.exceptions;

public class ImageNotFoundException extends ApiException {

    public ImageNotFoundException(String message, String errorCode) {
        super(message, errorCode);
    }

}
