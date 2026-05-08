package com.assettrack.sw_final_project_assettrack.security;

public enum AppRole {
    USER(0L),
    MANAGER(1L),
    ADMIN(2L);

    private final long id;

    AppRole(long id) {
        this.id = id;
    }

    public long getId() {
        return id;
    }

    public String authority() {
        return "ROLE_" + name();
    }

    public static AppRole fromId(long id) {
        for (AppRole role : values()) {
            if (role.id == id) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid role id: " + id);
    }
}
