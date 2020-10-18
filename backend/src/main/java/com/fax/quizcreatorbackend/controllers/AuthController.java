package com.fax.quizcreatorbackend.controllers;

import com.fax.quizcreatorbackend.entities.User;
import com.fax.quizcreatorbackend.repositories.UserRepository;
import com.fax.quizcreatorbackend.security.AuthenticationResponse;
import com.fax.quizcreatorbackend.security.JwtUtil;
import com.fax.quizcreatorbackend.services.UserDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder PASSWORD_ENCODER;

    public AuthController(UserRepository userRepository, AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JwtUtil jwtUtil, PasswordEncoder PASSWORD_ENCODER) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.PASSWORD_ENCODER = PASSWORD_ENCODER;
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody User user) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        } catch (BadCredentialsException e) {

            throw new Exception("Incorrect username or password", e);
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        return new ResponseEntity<>(new AuthenticationResponse(jwt), HttpStatus.OK);
    }

    @PostMapping("/registration")
    public ResponseEntity<Object> register(@RequestBody User user) {

        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            return new ResponseEntity<>("Nonempty username field should be included", HttpStatus.BAD_REQUEST);
        } else if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return new ResponseEntity<>("Nonempty password field should be included", HttpStatus.BAD_REQUEST);
        } else if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return new ResponseEntity<>("Username is already taken", HttpStatus.CONFLICT);
        } else {
            user.setPassword(PASSWORD_ENCODER.encode(user.getPassword()));
            userRepository.save(user);
            return new ResponseEntity<>(user.getUsername() + " has been created", HttpStatus.CREATED);
        }
    }
}
