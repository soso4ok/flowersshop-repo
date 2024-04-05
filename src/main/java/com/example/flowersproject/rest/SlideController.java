package com.example.flowersproject.rest;

import com.example.flowersproject.entity.SlideEntity;
import com.example.flowersproject.services.SlideService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("slides")
public class SlideController {

    @Autowired
    private SlideService slideService;

    @GetMapping
    public List<SlideEntity> getAllSlides() {
        return slideService.getAllSlides();
    }

    @PostMapping
    public ResponseEntity<SlideEntity> addSlide(@RequestPart("imageFile") MultipartFile imageFile) throws IOException {
        SlideEntity addedSlide = slideService.addSlide(imageFile);
        return new ResponseEntity<>(addedSlide, HttpStatus.CREATED);
    }

    @DeleteMapping("/{slideId}")
    public ResponseEntity<Void> deleteSlide(@PathVariable Long slideId) {
        slideService.deleteSlide(slideId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
