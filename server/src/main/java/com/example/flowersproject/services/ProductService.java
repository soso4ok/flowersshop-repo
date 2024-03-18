package com.example.flowersproject.services;

import com.example.flowersproject.dto.ProductDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ProductService {

    ResponseEntity<List<ProductDTO>> getAllProducts();

}
