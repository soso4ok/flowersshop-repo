package com.example.flowersproject.rest;

import com.example.flowersproject.dto.FlowerDTO;
import com.example.flowersproject.repository.ProductRepository;
import com.example.flowersproject.services.impl.ProductServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductServiceImpl productService;

    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        var list = productService.getAllProducts();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }


}
