package com.example.flowersproject.services.impl;

import com.example.flowersproject.dto.BlogDTO;
import com.example.flowersproject.entity.BlogEntity;
import com.example.flowersproject.repository.BlogRepository;
import com.example.flowersproject.services.BlogService;
import com.example.flowersproject.services.mappers.BlogMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final BlogMapper blogMapper;

    @Override
    public List<BlogDTO> getAllBlogs() {
        List<BlogEntity> blogs = blogRepository.findAll();
        return blogs.stream()
                .map(blogMapper::blogToDto)
                .collect(Collectors.toList());
    }

    @Override
    public BlogDTO getBlogById(Long id) {
        BlogEntity blog = blogRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
        return blogMapper.blogToDto(blog);
    }

    @Override
    public BlogDTO createBlog(BlogDTO blogDTO) {
        BlogEntity blog = blogMapper.dtoToBlog(blogDTO);
        BlogEntity savedBlog = blogRepository.save(blog);
        return blogMapper.blogToDto(savedBlog);
    }

    @Override
    public BlogDTO updateBlog(Long id, BlogDTO blogDTO) {
        BlogEntity existingBlog = blogRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);

        existingBlog.setTitle(blogDTO.getTitle());
        existingBlog.setContent(blogDTO.getContent());

        BlogEntity updatedBlog = blogRepository.save(existingBlog);
        return blogMapper.blogToDto(updatedBlog);
    }

    @Override
    public void deleteBlog(Long id) {
        BlogEntity blog = blogRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
        blogRepository.delete(blog);
    }
}
