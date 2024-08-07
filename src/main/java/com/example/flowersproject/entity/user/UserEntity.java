    package com.example.flowersproject.entity.user;

    import com.example.flowersproject.token.Token;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import org.hibernate.validator.constraints.UniqueElements;
    import org.springframework.data.relational.core.mapping.Table;
    import org.springframework.security.core.GrantedAuthority;
    import org.springframework.security.core.userdetails.UserDetails;

    import java.util.Collection;
    import java.util.List;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Table(name = "_user")
    public class UserEntity implements UserDetails {

        @Id
        @GeneratedValue
        private Integer id;
        private String firstname;
        private String lastname;
        private String email;
        private String password;

        @Enumerated(EnumType.STRING)
        private UserRole role;

        @OneToMany(mappedBy = "userEntity")
        private List<Token> tokens;

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return role.getAuthorities();
        }

        @Override
        public String getPassword() {
            return password;
        }

        @Override
        public String getUsername() {
            return email;
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return true;
        }
    }
