package com.fax.quizcreatorbackend.services;

import com.fax.quizcreatorbackend.entities.User;
import com.fax.quizcreatorbackend.repositories.UserRepository;
import com.fax.quizcreatorbackend.security.MyUserPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {
    private final UserRepository userRepository;

    public UserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(s);
        if (user.isPresent()) {
            return new MyUserPrincipal(user.get());
        } else {
            throw new UsernameNotFoundException(String.format("Username[%s] not found", s));
        }
    }
}
