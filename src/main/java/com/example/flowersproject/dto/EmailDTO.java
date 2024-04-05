package com.example.flowersproject.dto;

import lombok.Data;

@Data
public class EmailDTO {

    private String to;
    private String subject;
    private String text;

}
