package com.example.flowersproject.services.impl;

import com.example.flowersproject.dto.FlowerDTO;
import com.example.flowersproject.dto.ProductDTO;
import com.example.flowersproject.entity.product.ProductEntity;
import com.example.flowersproject.repository.ProductRepository;
import com.example.flowersproject.services.ProductService;
import com.example.flowersproject.services.mappers.ProductMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private ProductRepository productRepository;
    private ProductMapper productMapper;

    @Override
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductEntity> products = productRepository.findAll();
        List<ProductDTO> productDTOs = products.stream()
                .map(productMapper::productToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productDTOs);
    }

}
