package com.example.flowersproject.services.impl;

import com.example.flowersproject.dto.product.FlowerDTO;
import com.example.flowersproject.entity.products.ImageEntity;
import com.example.flowersproject.entity.products.FlowerEntity;
import com.example.flowersproject.entity.products.ProductEntity;
import com.example.flowersproject.repository.FlowerRepository;
import com.example.flowersproject.services.FlowerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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
     * @return List of ProductEntity representing all flowers.
     */
    @Override
    public List<ProductEntity> getAllFlowers() {
        return flowerRepository.findAll();
    }

    /**
     * Retrieves a flower entity by its unique identifier.
     *
     * @param flowerId The unique identifier of the flower.
     * @return ProductEntity representing the specified flower, or null if not found.
     */
    @Override
    public ProductEntity getFlowerById(Integer flowerId) {
        return flowerRepository.findById(flowerId).orElse(null);
    }

    /**
     * Creates a new flower entity with the provided FlowerDto and image file.
     *
     * @param flowerDTO   FlowerDto containing flower details.
     * @param imageFile   MultipartFile containing the image file for the flower.
     * @return ProductEntity representing the newly created flower entity, or null if not created.
     * @throws IOException if an error occurs during image processing.
     */
    @Override
    public ProductEntity createFlower(FlowerDTO flowerDTO,
                                      MultipartFile imageFile) throws IOException {

        if (imageFile != null && !imageFile.isEmpty()){

            ImageEntity imageEntity = imageService.saveImage(imageFile);

            FlowerEntity flowerEntity = new FlowerEntity();

                    flowerEntity.setName(flowerDTO.getName());
            flowerEntity.setDescription(flowerDTO.getDescription());
            flowerEntity.setPrice(flowerDTO.getPrice());
            flowerEntity.setAvailable(flowerDTO.getAvailable());
            flowerEntity.setImage(imageEntity);

            // Save the updated entity
            return flowerRepository.save(flowerEntity);

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

    /**
     * Updates an existing flower entity with the provided FlowerDto and image file.
     *
     * @param flowerId    The unique identifier of the flower to be updated.
     * @param flowerDto   FlowerDto containing updated flower details.
     * @param imageFile   MultipartFile containing the updated image file for the flower.
     * @return ProductEntity representing the updated flower entity, or null if not found.
     * @throws IOException if an error occurs during image processing.
     */
    @Override
    public ProductEntity updateFlower(Integer flowerId,
                                      FlowerDTO flowerDto,
                                      MultipartFile imageFile) throws IOException {

        ProductEntity originalEntity = flowerRepository.findById(flowerId).orElse(null);

        if (originalEntity == null) {
            return null; // Return null if the entity is not found
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            ImageEntity imageEntity = imageService.saveImage(imageFile);

            // Update the fields
            originalEntity.setName(flowerDto.getName());
            originalEntity.setDescription(flowerDto.getDescription());
            originalEntity.setPrice(flowerDto.getPrice());
            originalEntity.setAvailable(flowerDto.getAvailable());
            originalEntity.setImage(imageEntity);

            // Save the updated entity
            return flowerRepository.save(originalEntity);
        }

        return null;

    }

}