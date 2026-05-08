package com.assettrack.sw_final_project_assettrack.service;

import com.assettrack.sw_final_project_assettrack.dto.request.UserLoginRequest;
import com.assettrack.sw_final_project_assettrack.dto.request.UserRegisterRequest;
import com.assettrack.sw_final_project_assettrack.dto.request.UserUpdateRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.AuthResponse;
import com.assettrack.sw_final_project_assettrack.dto.response.UserResponse;
import com.assettrack.sw_final_project_assettrack.entity.User;
import com.assettrack.sw_final_project_assettrack.mapper.UserMapper;
import com.assettrack.sw_final_project_assettrack.repository.UserRepository;
import com.assettrack.sw_final_project_assettrack.security.AppRole;
import com.assettrack.sw_final_project_assettrack.security.CustomUserDetails;
import com.assettrack.sw_final_project_assettrack.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final UserMapper userMapper;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final AuthenticationManager authenticationManager;

	@Transactional
	public UserResponse register(UserRegisterRequest req) {
		String email = normalizeEmail(req.getEmail());
		if (userRepository.existsByEmailIgnoreCase(email)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
		}

		User user = userMapper.toEntity(req);
		user.setEmail(email);
		user.setPassword(passwordEncoder.encode(user.getPassword()));

		return userMapper.toResponse(userRepository.save(user));
	}

	public AuthResponse login(UserLoginRequest req) {
		String email = normalizeEmail(req.getEmail());

		try {
			var authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(email, req.getPassword())
			);

			CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
			User user = userRepository.findById(principal.getId())
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

			String token = jwtUtil.generateToken(user.getId(), principal.getRole());
			return userMapper.toAuthResponse(token, user);
		} catch (BadCredentialsException ex) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
		}
	}

	public UserResponse getById(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
		return userMapper.toResponse(user);
	}

	public List<UserResponse> listByRole(long roleId) {
		try {
			AppRole.fromId(roleId);
		} catch (IllegalArgumentException ex) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
		}
		return userRepository.findByRoleId(roleId).stream()
				.map(userMapper::toResponse)
				.collect(Collectors.toList());
	}

	@Transactional
	public UserResponse updateUser(UserUpdateRequest req) {
		User user = userRepository.findById(req.getId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

		if (req.getEmail() != null) {
			String email = normalizeEmail(req.getEmail());
			if (!email.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmailIgnoreCaseAndIdNot(email, user.getId())) {
				throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered by another user");
			}
			req.setEmail(email);
		}

		userMapper.updateEntityFromRequest(req, user);

		if (req.getPassword() != null && !req.getPassword().isBlank()) {
			user.setPassword(passwordEncoder.encode(req.getPassword()));
		}

		return userMapper.toResponse(userRepository.save(user));
	}

	@Transactional
	public UserResponse changeRole(Long userId, Long newRoleId) {
		AppRole role;
		try {
			role = AppRole.fromId(newRoleId);
		} catch (IllegalArgumentException ex) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
		}
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

		user.setRoleId(role.getId());
		return userMapper.toResponse(userRepository.save(user));
	}

	private String normalizeEmail(String email) {
		if (email == null || email.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
		}
		return email.trim().toLowerCase(Locale.ROOT);
	}
}
