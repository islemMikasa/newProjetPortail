package com.bezkoder.springjwt.controllers;

import java.util.Optional;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.payload.request.UpdateUserProfileRequest;
import com.bezkoder.springjwt.payload.response.MessageResponse;
import com.bezkoder.springjwt.repository.UserRepository;
import com.bezkoder.springjwt.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Endpoint pour récupérer les informations du profil de l'utilisateur connecté.
     * Accessible par un utilisateur connecté (ROLE_USER).
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        // Sécurité : S'assurer que l'utilisateur demande son propre profil
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        if (!userDetails.getId().equals(id)) {
            return new ResponseEntity<>(new MessageResponse("Accès refusé : vous ne pouvez consulter que votre propre profil."), HttpStatus.FORBIDDEN);
        }

        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Créer une réponse qui ne contient pas le mot de passe
            // Vous pouvez utiliser un DTO pour cela pour ne pas exposer le mot de passe haché.
            // Pour l'instant, on va créer une Map simple pour la réponse.
            // Ou mieux, on retourne l'objet User, en s'assurant que le champ password est ignoré lors de la sérialisation (ex: @JsonIgnore).
            
            // On peut simplement retourner l'objet User, mais il faut faire attention à ne pas retourner le password.
            // Le meilleur serait de créer un DTO (UserResponse). Mais pour cet exemple, on peut juste mapper les champs.
            
            // Retourner l'objet user directement. Assurez-vous que votre entité User n'expose pas le mot de passe dans l'API REST.
            // Ou créer une classe simple pour la réponse (UserProfileResponse par exemple).
            return ResponseEntity.ok(user); // Assurez-vous que le champ password est ignoré ou null
        } else {
            return new ResponseEntity<>(new MessageResponse("Utilisateur non trouvé."), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Endpoint pour mettre à jour le profil de l'utilisateur.
     * Accessible par un utilisateur connecté (ROLE_USER).
     */
    @PutMapping("/{id}/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @Valid @RequestBody UpdateUserProfileRequest updateRequest) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        if (!userDetails.getId().equals(id)) {
            return new ResponseEntity<>(new MessageResponse("Accès refusé : vous ne pouvez modifier que votre propre profil."), HttpStatus.FORBIDDEN);
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Erreur : Utilisateur non trouvé."));

        if (updateRequest.getNom() != null) user.setNom(updateRequest.getNom());
        if (updateRequest.getPrenom() != null) user.setPrenom(updateRequest.getPrenom());
        if (updateRequest.getEmail() != null) user.setEmail(updateRequest.getEmail());
        if (updateRequest.getNumtel() != null) user.setNumtel(updateRequest.getNumtel());
        if (updateRequest.getAddress() != null) user.setAddress(updateRequest.getAddress());

        if (updateRequest.getOldPassword() != null && !updateRequest.getOldPassword().isEmpty()) {
            if (updateRequest.getNewPassword() == null || updateRequest.getNewPassword().isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Veuillez fournir un nouveau mot de passe."));
            }

            if (!passwordEncoder.matches(updateRequest.getOldPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body(new MessageResponse("L'ancien mot de passe est incorrect."));
            }

            user.setPassword(passwordEncoder.encode(updateRequest.getNewPassword()));
        }

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Profil mis à jour avec succès !"));
    }
}