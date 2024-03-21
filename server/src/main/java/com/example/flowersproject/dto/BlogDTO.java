package com.example.flowersproject.dto;

import lombok.Data;

import java.util.Date;

@Data
public class BlogDTO {
    private Long id;
    private String title;
    private String content;
    private Date createdAt;
}
