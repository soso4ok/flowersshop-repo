package com.example.flowersproject.exceptions;

import com.example.flowersproject.dto.BouquetDTO;
import com.example.flowersproject.services.impl.BouquetServiceImpl;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/v1/products/bouquets")
@RequiredArgsConstructor
public class BouquetController {

    private final BouquetServiceImpl bouquetService;

    @GetMapping
    public ResponseEntity<List<BouquetDTO>> getAllBouquet() {
        List<BouquetDTO> list =
                bouquetService.getAllBouquets();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBouquetById(@PathVariable("id") Long id) {
        try {
            BouquetDTO productEntity = bouquetService.getBouquetById(id);
            return ResponseEntity.ok(productEntity);
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Bouquet not found with ID");
        }
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> createBouquet(
            @RequestPart("bouquetRequest") BouquetDTO bouquetDTO,
            @RequestPart("imageFile") MultipartFile imageFile
    ) throws IOException {
        var createdResponse = bouquetService.createBouquet(bouquetDTO, imageFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFlower(
            @PathVariable Long id,
            @ModelAttribute BouquetDTO updatedProduct,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        try {
            var updatedEntity = bouquetService.updateBouquet(id, updatedProduct, imageFile);
            return updatedEntity != null ?
                    ResponseEntity.ok(updatedEntity) :
                    ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while updating bouquet: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFlowerById(@PathVariable("id") Long id) {
        try {
            bouquetService.deleteBouquet(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ProductNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Bouquet not found");
        }
    }

}
