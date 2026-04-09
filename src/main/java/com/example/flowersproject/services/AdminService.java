package com.example.flowersproject.services;

import com.example.flowersproject.dto.AdminDashboardStats;
import com.example.flowersproject.dto.AdminUserDTO;
import com.example.flowersproject.entity.order.OrderEntity;
import com.example.flowersproject.entity.user.UserEntity;
import com.example.flowersproject.repository.OrderRepository;
import com.example.flowersproject.repository.ProductRepository;
import com.example.flowersproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public AdminDashboardStats getDashboardStats() {
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();

        double totalRevenue = orderRepository.findAll()
                .stream()
                .mapToDouble(OrderEntity::getTotalPrice)
                .sum();

        return new AdminDashboardStats(totalOrders, totalUsers, totalProducts, totalRevenue);
    }

    public List<AdminUserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new AdminUserDTO(
                        user.getId(),
                        user.getFirstname(),
                        user.getLastname(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getEnabled()))
                .collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteUser(Integer id, String currentUserEmail) {
        UserEntity target = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (target.getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("You cannot delete your own account");
        }

        // Delete associated orders first to avoid foreign key constraints
        List<OrderEntity> orders = orderRepository.findByUser_Id(id);
        if (!orders.isEmpty()) {
            orderRepository.deleteAll(orders);
        }

        userRepository.delete(target);
    }
}
