package com.example.flowersproject.repository.specs;

import com.example.flowersproject.entity.product.ProductEntity;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static <T extends ProductEntity> Specification<T> hasPriceGreaterThanOrEqual(Double minPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
        };
    }

    public static <T extends ProductEntity> Specification<T> hasPriceLessThanOrEqual(Double maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (maxPrice == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }

    public static <T extends ProductEntity> Specification<T> nameContains(String search) {
        return (root, query, criteriaBuilder) -> {
            if (search == null || search.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("name")),
                    "%" + search.toLowerCase() + "%");
        };
    }

    public static <T extends ProductEntity> Specification<T> isAvailable(String available) {
        return (root, query, criteriaBuilder) -> {
            if (available == null || available.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("available"), available);
        };
    }

    public static <T extends ProductEntity> Specification<T> hasPriceBetween(Double minPrice, Double maxPrice) {
        Specification<T> spec = Specification.where(null);
        if (minPrice != null) {
            spec = spec.and(hasPriceGreaterThanOrEqual(minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and(hasPriceLessThanOrEqual(maxPrice));
        }
        return spec;
    }
}
