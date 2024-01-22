package com.example.flowersproject.rest;

import com.example.flowersproject.dto.product.FlowerRequest;
import com.example.flowersproject.dto.product.FlowerResponse;
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
    public ResponseEntity<List<FlowerResponse>> getAllFlowers() {
        List<FlowerResponse> list =
                productService.getAllFlowers();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<FlowerResponse> getFlowerId(@PathVariable Integer id) {
        FlowerResponse productEntity = productService.getFlowerById(id);

        return productEntity != null ?
                ResponseEntity.ok(productEntity) :
                ResponseEntity.notFound().build();

    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FlowerResponse> createFlower(
            @ModelAttribute FlowerRequest flowerRequest,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        try {
            FlowerResponse createdResponse =
                    productService.createFlower(flowerRequest, imageFile);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdResponse);

        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @PutMapping("/{flowerId}")
    public ResponseEntity<FlowerResponse> updateFlower(
            @PathVariable Integer flowerId,
            @ModelAttribute FlowerRequest updatedProduct,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        try {
            FlowerResponse updatedEntity =
                    productService.updateFlower(flowerId, updatedProduct, imageFile);

            return updatedEntity != null ?
                    ResponseEntity.ok(updatedEntity) :
                    ResponseEntity.notFound().build();

        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteFlower(@PathVariable Integer flowerId){
        productService.deleteFlower(flowerId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
