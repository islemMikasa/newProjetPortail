package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.Account;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.payload.response.ClientProfileResponse;
import com.bezkoder.springjwt.repository.AccountRepository;
import com.bezkoder.springjwt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class ClientController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    AccountRepository accountRepository;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> getUserProfileByUsername(@RequestParam String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        Optional<Account> accountOptional = Optional.empty();

        String rib = accountOptional.map(Account::getRib).orElse(null);
        BigDecimal solde = accountOptional.map(Account::getSolde).orElse(null);

        ClientProfileResponse profileResponse = new ClientProfileResponse(
            user.getUsername(),
            user.getEmail(),
            user.getNom(),
            user.getPrenom(),
            user.getNumtel(),
            rib,
            solde);

        return ResponseEntity.ok(profileResponse);}
}