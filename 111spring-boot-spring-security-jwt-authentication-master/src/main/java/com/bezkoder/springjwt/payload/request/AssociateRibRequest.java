package com.bezkoder.springjwt.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AssociateRibRequest {
    @NotBlank(message = "Le RIB est obligatoire.")
    @Size(min = 20, max = 20, message = "Le RIB doit contenir exactement 20 caractères.")
    private String rib;

    public String getRib() { return rib; }
    public void setRib(String rib) { this.rib = rib; }
}