package com.example.flowersproject.rest.exceptions;

import com.example.flowersproject.rest.exceptions.ApiException;

public class ImageNotFoundException extends ApiException {

    public ImageNotFoundException(String message, String errorCode) {
        super(message, errorCode);
    }

}
