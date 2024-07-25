package com.example.flowersproject.services.mappers;

import com.example.flowersproject.dto.UserDTO;
import com.example.flowersproject.dto.UserDTO.UserDTOBuilder;
import com.example.flowersproject.entity.user.UserEntity;
import com.example.flowersproject.entity.user.UserEntity.UserEntityBuilder;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-07-20T17:45:13+0200",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.12 (Amazon.com Inc.)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDTO userEntityToDto(UserEntity userEntity) {
        if ( userEntity == null ) {
            return null;
        }

        UserDTOBuilder userDTO = UserDTO.builder();

        userDTO.id( userEntity.getId() );
        userDTO.firstname( userEntity.getFirstname() );
        userDTO.lastname( userEntity.getLastname() );
        userDTO.email( userEntity.getEmail() );
        userDTO.password( userEntity.getPassword() );
        userDTO.role( userEntity.getRole() );

        return userDTO.build();
    }

    @Override
    public UserEntity userDtoToEntity(UserDTO userDTO) {
        if ( userDTO == null ) {
            return null;
        }

        UserEntityBuilder userEntity = UserEntity.builder();

        userEntity.id( userDTO.getId() );
        userEntity.firstname( userDTO.getFirstname() );
        userEntity.lastname( userDTO.getLastname() );
        userEntity.email( userDTO.getEmail() );
        userEntity.password( userDTO.getPassword() );
        userEntity.role( userDTO.getRole() );

        return userEntity.build();
    }
}
