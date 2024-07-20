package com.example.flowersproject.services.mappers;

import com.example.flowersproject.dto.BlogDTO;
import com.example.flowersproject.entity.BlogEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-07-20T17:45:13+0200",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.12 (Amazon.com Inc.)"
)
@Component
public class BlogMapperImpl implements BlogMapper {

    @Override
    public BlogDTO blogToDto(BlogEntity blog) {
        if ( blog == null ) {
            return null;
        }

        BlogDTO blogDTO = new BlogDTO();

        blogDTO.setId( blog.getId() );
        blogDTO.setTitle( blog.getTitle() );
        blogDTO.setContent( blog.getContent() );
        blogDTO.setCreatedAt( blog.getCreatedAt() );
        blogDTO.setImage( blog.getImage() );

        return blogDTO;
    }

    @Override
    public BlogEntity dtoToBlog(BlogDTO blogDTO) {
        if ( blogDTO == null ) {
            return null;
        }

        BlogEntity blogEntity = new BlogEntity();

        blogEntity.setTitle( blogDTO.getTitle() );
        blogEntity.setContent( blogDTO.getContent() );
        blogEntity.setCreatedAt( blogDTO.getCreatedAt() );
        blogEntity.setImage( blogDTO.getImage() );
        blogEntity.setId( blogDTO.getId() );

        return blogEntity;
    }
}
