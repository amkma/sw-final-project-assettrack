package com.assettrack.sw_final_project_assettrack.service;

import com.assettrack.sw_final_project_assettrack.dto.request.UserLoginRequest;
import com.assettrack.sw_final_project_assettrack.dto.request.UserRegisterRequest;
import com.assettrack.sw_final_project_assettrack.dto.request.UserUpdateRequest;
import com.assettrack.sw_final_project_assettrack.dto.response.UserResponse;
import com.assettrack.sw_final_project_assettrack.entity.User;
import com.assettrack.sw_final_project_assettrack.mapper.UserMapper;
import com.assettrack.sw_final_project_assettrack.repository.UserRepository;
import com.assettrack.sw_final_project_assettrack.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final UserMapper userMapper;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;

	public UserResponse register(UserRegisterRequest req) {
		if (userRepository.existsByEmail(req.getEmail())) {
			throw new RuntimeException("Email is already registered");
		}

		User user = userMapper.toEntity(req);
		String hashed = passwordEncoder.encode(user.getPassword());
		user.setPassword(hashed);
		User saved = userRepository.save(user);
		return userMapper.toResponse(saved);
	}

	public String login(UserLoginRequest req) {
		User user = userRepository.findByEmail(req.getEmail());
		if (user == null) throw new RuntimeException("Invalid credentials");

		if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
			throw new RuntimeException("Invalid credentials");
		}

		return jwtUtil.generateToken(user);
	}

	public UserResponse getById(Long id) {
		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
		return userMapper.toResponse(user);
	}

	public List<UserResponse> listByRole(long roleId) {
		List<User> users = userRepository.findByRoleId(roleId);
		return users.stream().map(userMapper::toResponse).collect(Collectors.toList());
	}

	@PreAuthorize("hasRole('ADMIN')")
	public UserResponse updateUser(UserUpdateRequest req) {
		User user = userRepository.findById(req.getId()).orElseThrow(() -> new RuntimeException("User not found"));

		// if email is changing, ensure uniqueness
		if (req.getEmail() != null && !req.getEmail().equals(user.getEmail())) {
			if (userRepository.existsByEmail(req.getEmail())) {
				throw new RuntimeException("Email is already registered by another user");
			}
		}

		userMapper.updateEntityFromRequest(req, user);

		if (req.getPassword() != null) {
			user.setPassword(passwordEncoder.encode(req.getPassword()));
		}

		User saved = userRepository.save(user);
		return userMapper.toResponse(saved);
	}

	@PreAuthorize("hasRole('ADMIN')")
	public UserResponse changeRole(Long userId, Long newRoleId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		user.setRoleId(newRoleId);
		User saved = userRepository.save(user);
		return userMapper.toResponse(saved);
	}

}
