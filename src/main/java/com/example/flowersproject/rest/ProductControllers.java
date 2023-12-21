package com.example.flowersproject.rest;

import com.example.flowersproject.entity.ProductEntity;
import com.example.flowersproject.services.impl.ProductServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/v1/products")
@RequiredArgsConstructor
@Validated
public class ProductControllers {

    private final ProductServiceImpl productService;

    @GetMapping
    public ResponseEntity<List<ProductEntity>> getAllProducts() {
        List<ProductEntity> list =  productService.getAllProducts();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductEntity> getProductId(@PathVariable Integer id) {
        ProductEntity productEntity = productService.getProductById(id);

        if (productEntity != null) {
            return new ResponseEntity<>(productEntity, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductEntity> createProduct(
            @RequestPart("product") ProductEntity product,
            @RequestPart("imageFile") MultipartFile imageFile) {
        try {
            ProductEntity createdEntity = productService.createProduct(product, imageFile);
            return new ResponseEntity<>(createdEntity, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @PutMapping("/{productId}")
    public ResponseEntity<ProductEntity> updateProduct(
            @PathVariable Integer productId,
            @RequestParam ProductEntity updatedProduct
    ) {
        ProductEntity update = productService.updateProduct(productId, updatedProduct);

        if (update != null) {
            return new ResponseEntity<>(update, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer productId){
        productService.deleteProduct(productId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
