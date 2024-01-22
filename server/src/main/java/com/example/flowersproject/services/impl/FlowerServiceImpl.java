package com.example.flowersproject.services.impl;

import com.example.flowersproject.dto.product.FlowerRequest;
import com.example.flowersproject.dto.product.FlowerResponse;
import com.example.flowersproject.entity.products.ImageEntity;
import com.example.flowersproject.entity.products.FlowerEntity;
import com.example.flowersproject.entity.products.ProductEntity;
import com.example.flowersproject.repository.FlowerRepository;
import com.example.flowersproject.services.FlowerService;
import com.example.flowersproject.services.util.FlowerUpdater;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlowerServiceImpl implements FlowerService {

    @Autowired
    private FlowerRepository flowerRepository;

    @Autowired
    private ImageServiceImpl imageService;

    /**
     * Retrieves a list of all flowers.
     *
     * This method fetches all flower entities from the repository and transforms them
     * into a list of FlowerResponse objects using the FlowerResponse.fromEntity method.
     *
     * @return List of FlowerResponse representing all flowers.
     */
    @Override
    public List<FlowerResponse> getAllFlowers() {
        List<FlowerEntity> flowerEntities = flowerRepository.findAll();
        return flowerEntities.stream()
                .map(FlowerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a flower entity by its unique identifier.
     *
     * Method queries the flower repository for a flower entity with the specified identifier.
     * If found, it transforms the entity into a FlowerResponse object using the FlowerResponse.fromEntity method.
     * If not found, it returns null.
     *
     * @param flowerId The unique identifier of the flower.
     * @return FlowerResponse representing the specified flower, or null if not found.
     */
    @Override
    public FlowerResponse getFlowerById(Integer flowerId) {
        return flowerRepository.findById(flowerId)
                .map(FlowerResponse::fromEntity)
                .orElse(null);
    }

    /**
     * Creates a new flower entity with the provided FlowerDto and image file.
     *
     * @param flowerRequest FlowerDto containing flower details.
     * @param imageFile     MultipartFile containing the image file for the flower.
     * @return ProductEntity representing the newly created flower entity, or null if not created.
     * @throws IOException if an error occurs during image processing.
     */
    @Override
    public FlowerResponse createFlower(FlowerRequest flowerRequest,
                                       MultipartFile imageFile) throws IOException {

        if (imageFile != null && !imageFile.isEmpty()){

            ImageEntity imageEntity = imageService.saveImage(imageFile);

            FlowerEntity flowerEntity = new FlowerEntity();
            FlowerUpdater.updateFields(flowerEntity, flowerRequest, imageEntity);

            // Save the updated entity
            return FlowerResponse.fromEntity(flowerRepository.save(flowerEntity));

        }

        return null;

    }

    /**
     * Updates an existing flower entity with the provided FlowerDto and image file.
     *
     * @param flowerId    The unique identifier of the flower to be updated.
     * @param flowerRequest   FlowerDto containing updated flower details.
     * @param imageFile   MultipartFile containing the updated image file for the flower.
     * @return ProductEntity representing the updated flower entity, or null if not found.
     * @throws IOException if an error occurs during image processing.
     */
    @Override
    public FlowerResponse updateFlower(Integer flowerId,
                                      FlowerRequest flowerRequest,
                                      MultipartFile imageFile) throws IOException {

        FlowerEntity flowerEntity =
                flowerRepository.findById(flowerId)
                                .orElse(null);

        if (flowerEntity == null) {
            return null; // Return null if the entity is not found
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            ImageEntity imageEntity = imageService.saveImage(imageFile);

            // Update the fields
            FlowerUpdater.updateFields(flowerEntity, flowerRequest, imageEntity);

            // Save the updated entity
            return FlowerResponse.fromEntity(flowerRepository.save(flowerEntity));
        }

        return null;

    }

    /**
     * Deletes a flower entity by its unique identifier.
     *
     * @param flowerId The unique identifier of the flower to be deleted.
     */
    @Override
    public void deleteFlower(Integer flowerId) {
        flowerRepository.deleteById(flowerId);
    }



}