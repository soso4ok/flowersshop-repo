package com.example.flowersproject.rest;

import com.example.flowersproject.dto.FlowerDTO;
import com.example.flowersproject.entity.product.FlowerType;
import com.example.flowersproject.services.impl.FlowerServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("api/v1/products/flowers")
@RequiredArgsConstructor
public class FlowerController {

        private final FlowerServiceImpl flowerService;

        @GetMapping
        public ResponseEntity<?> getAllFlowers(
                        @RequestParam(required = false) Double minPrice,
                        @RequestParam(required = false) Double maxPrice,
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false, defaultValue = "id") String sortBy,
                        @RequestParam(required = false, defaultValue = "asc") String sortDir,
                        @RequestParam(required = false) FlowerType type) {
                var list = flowerService.getAllFlowers(minPrice, maxPrice, search, sortBy, sortDir, type);
                return new ResponseEntity<>(list.getBody(), HttpStatus.OK);
        }

        @GetMapping("/{id}")
        public ResponseEntity<?> getFlowerById(@PathVariable("id") Long id) {
                var productEntity = flowerService.getFlowerById(id);
                return ResponseEntity.ok(productEntity);
        }

        @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
        public ResponseEntity<?> createFlower(
                        @RequestPart("flowerRequest") FlowerDTO flowerDTO,
                        @RequestPart("imageFile") MultipartFile imageFile) {
                var createdResponse = flowerService.createFlower(flowerDTO, imageFile);
                return ResponseEntity.status(HttpStatus.CREATED).body(createdResponse);
        }

        @PutMapping("/{id}")
        public ResponseEntity<?> updateFlower(
                        @PathVariable("id") Long id,
                        @ModelAttribute FlowerDTO updatedProduct,
                        @RequestParam("imageFile") MultipartFile imageFile) throws IOException {
                var updatedEntity = flowerService.updateFlower(id, updatedProduct, imageFile);
                return updatedEntity != null ? ResponseEntity.ok(updatedEntity) : ResponseEntity.notFound().build();
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteFlowerById(@PathVariable("id") Long id) {
                flowerService.deleteFlower(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

}
