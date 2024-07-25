package com.example.flowersproject.dto;

import com.example.flowersproject.entity.product.ImageEntity;
import lombok.Data;

import java.util.Date;

@Data
public class BlogDTO {
    private Long id;
    private String title;
    private String content;
    private Date createdAt;
    private ImageEntity image;
}
