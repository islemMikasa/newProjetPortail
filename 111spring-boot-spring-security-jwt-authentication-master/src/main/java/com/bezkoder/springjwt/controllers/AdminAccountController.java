package com.bezkoder.springjwt.controllers;

import java.math.BigDecimal;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.dao.DataIntegrityViolationException;

import com.bezkoder.springjwt.models.Account;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.payload.request.BalanceUpdateRequest;
import com.bezkoder.springjwt.payload.request.PrioritizationRequest;
import com.bezkoder.springjwt.payload.response.MessageResponse;
import com.bezkoder.springjwt.repository.AccountRepository;
import com.bezkoder.springjwt.repository.UserRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/accounts")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAccountController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/{accountId}/balance")
    public ResponseEntity<?> updateAccountBalance(@PathVariable Long accountId,
            @Valid @RequestBody BalanceUpdateRequest request) {
        return accountRepository.findById(accountId)
                .map(account -> {
                    try {
                        BigDecimal newBalance = request.getNewBalance();
                        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                            return ResponseEntity.badRequest()
                                    .body(new MessageResponse("Erreur : Le solde ne peut pas être négatif."));
                        }
                        account.setSolde(newBalance);
                        accountRepository.save(account);
                        return ResponseEntity.ok(new MessageResponse("Account balance updated successfully by admin."));
                    } catch (NumberFormatException e) {
                        return ResponseEntity.badRequest()
                                .body(new MessageResponse("Erreur : Format de solde invalide."));
                    }
                })
                .orElseGet(() -> ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Account not found with ID: " + accountId)));
    }

    @PostMapping("/prioritize")
    public ResponseEntity<?> prioritizeClient(@Valid @RequestBody PrioritizationRequest request) {
        try {
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé !"));
            
            // <-- NOUVEAU CHANGEMENT ICI : Vérifier si l'utilisateur a déjà un compte
            if (user.getAccount() != null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Erreur : Cet utilisateur a déjà un compte."));
            }

            if (accountRepository.findByRib(request.getRib()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Erreur : Le RIB existe déjà !"));
            }

            Account account = new Account();
            account.setRib(request.getRib());
            account.setSolde(new BigDecimal(request.getSolde())); 

            // <-- CHANGEMENT ICI : Utiliser setAccount à la place de addAccount
            user.setAccount(account);
            account.setUser(user); // Mettre à jour la relation bidirectionnelle
            
            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("Priorisation effectuée avec succès !"));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Erreur : Format de solde invalide."));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Erreur : Contrainte de base de données violée."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Erreur : " + e.getMessage()));
        }
    }
}