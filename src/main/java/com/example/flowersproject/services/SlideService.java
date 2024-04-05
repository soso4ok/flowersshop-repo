package com.example.flowersproject.services;

import com.example.flowersproject.entity.SlideEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface SlideService {

    public List<SlideEntity> getAllSlides();

    public SlideEntity addSlide(MultipartFile imageFile) throws IOException;

    public void deleteSlide(Long slideId);

}
