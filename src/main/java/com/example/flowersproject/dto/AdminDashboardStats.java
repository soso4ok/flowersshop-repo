package com.example.flowersproject.dto;

public record AdminDashboardStats(
        long totalOrders,
        long totalUsers,
        long totalProducts,
        double totalRevenue) {
}
