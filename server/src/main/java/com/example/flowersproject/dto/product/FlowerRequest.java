package com.example.flowersproject.dto.product;

import lombok.Data;

@Data
public class FlowerRequest {

    private String name;
    private String description;
    private String price;
    private String available;

}
