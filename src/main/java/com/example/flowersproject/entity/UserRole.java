package com.example.flowersproject.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public enum UserRole {

    USER(Collections.emptySet()),
    ADMIN(Set.of(Permission.ADMIN_READ,
                Permission.ADMIN_CREATE,
                Permission.ADMIN_DELETE,
                Permission.ADMIN_UPDATE));


    public Collection<? extends GrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN")); // Added this line
        return authorities;
    }


    @Getter
    private final Set<Permission> permissions;
}
