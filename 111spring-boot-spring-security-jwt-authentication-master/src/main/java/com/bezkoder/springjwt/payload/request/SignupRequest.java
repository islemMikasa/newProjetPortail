package com.bezkoder.springjwt.payload.request;

import java.util.Set;

import jakarta.validation.constraints.*;

public class SignupRequest {
    @NotBlank(message = "Le nom d'utilisateur est obligatoire.")
    @Size(min = 3, max = 20, message = "Le nom d'utilisateur doit contenir entre 3 et 20 caractères.")
    private String username;

    @NotBlank(message = "L'email est obligatoire.")
    @Size(max = 50, message = "L'email ne doit pas dépasser 50 caractères.")
    @Email(message = "L'adresse email doit être valide.")
    private String email;

    @NotBlank(message = "Le nom est obligatoire.")
    @Size(max = 50, message = "Le nom ne doit pas dépasser 50 caractères.")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire.")
    @Size(max = 50, message = "Le prénom ne doit pas dépasser 50 caractères.")
    private String prenom;

    @NotBlank(message = "Le numéro de téléphone est obligatoire.")
    @Size(min = 8, max = 8, message = "Le numéro de téléphone doit contenir entre 8 et 20 caractères.")
    private String numtel;

    @NotBlank(message = "L'adresse est obligatoire.")
    @Size(max = 100, message = "L'adresse ne doit pas dépasser 100 caractères.")
    private String addresse;

    @NotBlank(message = "Le mot de passe est obligatoire.")
    @Size(min = 6, max = 40, message = "Le mot de passe doit contenir entre 6 et 40 caractères.")
    private String password;
    
    @NotBlank(message = "Le RIB est obligatoire.")
    @Size(min = 20, max = 20, message = "Le RIB doit contenir exactement 20 chiffres.")
    @Pattern(regexp = "^32.*", message = "Le RIB doit commencer par '32'.")
    private String rib;
    
    private Set<String> role;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getNumtel() { return numtel; }
    public void setNumtel(String numtel) { this.numtel = numtel; }
    public String getAddress() { return addresse; }
    public void setAddress(String addresse) { this.addresse = addresse; }
    
    public String getRib() {
        return rib;
    }

    public void setRib(String rib) {
        this.rib = rib;
    }
    
    public Set<String> getRole() {
		return this.role;
	}

	public void setRole(Set<String> role) {
		this.role = role;
	}
	
}