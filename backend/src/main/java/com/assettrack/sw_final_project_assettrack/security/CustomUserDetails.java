package com.assettrack.sw_final_project_assettrack.security;

import com.assettrack.sw_final_project_assettrack.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String email;
    private final String password;
    private final AppRole role;
    private final Collection<? extends GrantedAuthority> authorities;

    private CustomUserDetails(Long id, String email, String password, AppRole role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.authorities = List.of(new SimpleGrantedAuthority(role.authority()));
    }

    public static CustomUserDetails from(User user) {
        return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                AppRole.fromId(user.getRoleId())
        );
    }

    public Long getId() {
        return id;
    }

    public String getRole() {
        return role.name();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
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
