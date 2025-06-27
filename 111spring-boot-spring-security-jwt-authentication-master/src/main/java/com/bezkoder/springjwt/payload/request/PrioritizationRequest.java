package com.bezkoder.springjwt.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class PrioritizationRequest {
    @NotBlank(message = "Le username est obligatoire.")
    @Size(min = 3, max = 20, message = "Le username doit contenir entre 3 et 20 caractères.")
    private String username;

    @NotBlank(message = "Le RIB est obligatoire.")
    @Size(min = 20, max = 20, message = "Le RIB doit contenir exactement 20 caractères.")
    private String rib;

    @NotBlank(message = "Le solde est obligatoire.")
    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "Le solde doit être un nombre valide (ex. 1000.00)")
    private String solde;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getRib() { return rib; }
    public void setRib(String rib) { this.rib = rib; }
    public String getSolde() { return solde; }
    public void setSolde(String solde) { this.solde = solde; }
}