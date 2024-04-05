package com.example.flowersproject.repository;

import com.example.flowersproject.entity.order.OrderEntity;
import com.example.flowersproject.entity.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    List findByUserId(Long userId);

}
