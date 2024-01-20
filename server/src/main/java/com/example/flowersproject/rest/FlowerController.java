package com.example.flowersproject.rest;

import com.example.flowersproject.dto.product.FlowerDTO;
import com.example.flowersproject.entity.products.ProductEntity;
import com.example.flowersproject.services.impl.FlowerServiceImpl;
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
@RequestMapping("api/v1/flowers")
@RequiredArgsConstructor
@Validated
public class FlowerController {

    private final FlowerServiceImpl productService;

    @GetMapping
    public ResponseEntity<List<ProductEntity>> getAllFlowers() {
        List<ProductEntity> list =  productService.getAllFlowers();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductEntity> getFlowerId(@PathVariable Integer id) {
        ProductEntity productEntity = productService.getFlowerById(id);

        return productEntity != null ?
                ResponseEntity.ok(productEntity) :
                ResponseEntity.notFound().build();

    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductEntity> createFlower(
            @ModelAttribute FlowerDTO flowerDto,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        try {
            ProductEntity createdEntity = productService.createFlower(flowerDto, imageFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEntity);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{flowerId}")
    public ResponseEntity<ProductEntity> updateFlower(
            @PathVariable Integer flowerId,
            @ModelAttribute FlowerDTO updatedProduct,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        try {
            ProductEntity updatedEntity = productService.updateFlower(flowerId, updatedProduct, imageFile);

            return updatedEntity != null ?
                    ResponseEntity.ok(updatedEntity) :
                    ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteFlower(@PathVariable Integer flowerId){
        productService.deleteFlower(flowerId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
