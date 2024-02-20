package com.example.flowersproject.rest;

import com.example.flowersproject.entity.dto.product.FlowerDTO;
import com.example.flowersproject.rest.exceptions.ImageNotFoundException;
import com.example.flowersproject.rest.exceptions.ProductNotFoundException;
import com.example.flowersproject.services.impl.FlowerServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/v1/products/flowers")
@RequiredArgsConstructor
public class FlowerController {

    private final FlowerServiceImpl flowerService;

    @GetMapping
    public ResponseEntity<List<FlowerDTO>> getAllFlowers() {
        List<FlowerDTO> list =
                flowerService.getAllFlowers();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFlowerById(@PathVariable("id") Long id) {
        try {
            FlowerDTO productEntity = flowerService.getFlowerById(id);
            return ResponseEntity.ok(productEntity);
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Flower not found with ID");
        }
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> createFlower(
            @RequestPart("flowerRequest") FlowerDTO flowerDTO,
            @RequestPart("imageFile") MultipartFile imageFile
    ) {
        try {
            FlowerDTO createdResponse = flowerService.createFlower(flowerDTO, imageFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdResponse);
        } catch (ImageNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFlower(
            @PathVariable Long id,
            @ModelAttribute FlowerDTO updatedProduct,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        try {
            FlowerDTO updatedEntity = flowerService.updateFlower(id, updatedProduct, imageFile);
            return updatedEntity != null ?
                    ResponseEntity.ok(updatedEntity) :
                    ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while updating flower: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFlowerById(@PathVariable("id") Long id) {
        try {
            flowerService.deleteFlower(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ProductNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Flower not found.");
        }
    }

}
