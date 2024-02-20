package com.example.flowersproject.security.exceptions;

import com.example.flowersproject.rest.exceptions.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class UnauthorizedExeption extends ApiException {
    public UnauthorizedExeption(String message) {
        super(message, "FLOWERSSHOP_UNAUTHORIZED");
    }
}
