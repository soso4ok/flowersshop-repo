package com.example.flowersproject.repository;

import com.example.flowersproject.entity.user.AddressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<AddressEntity, Long> {
    List<AddressEntity> findAllByUserId(Integer userId);

    Optional<AddressEntity> findByIdAndUserId(Long id, Integer userId);
}
