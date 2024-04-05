package com.example.flowersproject.services.impl;

import com.example.flowersproject.entity.product.ImageEntity;
import com.example.flowersproject.entity.SlideEntity;
import com.example.flowersproject.repository.SlideRepository;
import com.example.flowersproject.services.SlideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class SlideServiceImpl implements SlideService {

    @Autowired
    private ImageServiceImpl imageService;

    @Autowired
    private SlideRepository slideRepository;

    @Override
    public List<SlideEntity> getAllSlides() {
        return slideRepository.findAll();
    }

    @Override
    public SlideEntity addSlide(MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            ImageEntity imageEntity = imageService.uploadImage(imageFile);
            SlideEntity slideEntity = new SlideEntity();
            slideEntity.setImage(imageEntity);
            return slideRepository.save(slideEntity);
        }
        return null;
    }

    @Override
    public void deleteSlide(Long slideId) {
        slideRepository.deleteById(slideId);
    }
}
