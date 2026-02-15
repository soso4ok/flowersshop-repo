package com.example.flowersproject.rest;

import com.example.flowersproject.dto.AddressDTO;
import com.example.flowersproject.entity.user.AddressEntity;
import com.example.flowersproject.entity.user.UserEntity;
import com.example.flowersproject.repository.AddressRepository;
import com.example.flowersproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<AddressDTO>> getAddresses(@AuthenticationPrincipal UserEntity user) {
        List<AddressEntity> addresses = addressRepository.findAllByUserId(user.getId());
        List<AddressDTO> dtos = addresses.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<AddressDTO> addAddress(
            @AuthenticationPrincipal UserEntity user,
            @RequestBody AddressDTO dto) {
        AddressEntity address = AddressEntity.builder()
                .city(dto.getCity())
                .street(dto.getStreet())
                .postalCode(dto.getPostalCode())
                .country(dto.getCountry())
                .user(user)
                .build();
        AddressEntity saved = addressRepository.save(address);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable Long id) {
        return addressRepository.findByIdAndUserId(id, user.getId())
                .map(address -> {
                    addressRepository.delete(address);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private AddressDTO toDto(AddressEntity entity) {
        return AddressDTO.builder()
                .id(entity.getId())
                .city(entity.getCity())
                .street(entity.getStreet())
                .postalCode(entity.getPostalCode())
                .country(entity.getCountry())
                .build();
    }
}
