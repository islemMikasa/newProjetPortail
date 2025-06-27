package com.bezkoder.springjwt.payload.response;

import java.math.BigDecimal;

public class ClientProfileResponse {
    private String username;
    private String email;
    private String nom;
    private String prenom;
    private String numtel;
    private String rib;
    private BigDecimal solde;

    public ClientProfileResponse(String username, String email, String nom, String prenom, String numtel, String rib, BigDecimal solde) {
        this.username = username;
        this.email = email;
        this.nom = nom;
        this.prenom = prenom;
        this.numtel = numtel;
        this.rib = rib;
        this.solde = solde;
    }

    
    public String getUsername() {
    	return username; }
    
    public void setUsername(String username) { 
    	this.username = username; }
    
    public String getEmail() { 
    	return email; }
    
    public void setEmail(String email) {
    	this.email = email; }
    
    public String getNom() { 
    	return nom; }
    
    public void setNom(String nom) {
    	this.nom = nom; }
    
    public String getPrenom() {
    	return prenom; }
    
    public void setPrenom(String prenom) { 
    	this.prenom = prenom; }
    
    public String getNumtel() {
    	return numtel; }
    
    public void setNumtel(String numtel) { 
    	this.numtel = numtel; }
    
    public String getRib() {
    	return rib; }
    
    public void setRib(String rib) {
    	this.rib = rib; }
    
    public BigDecimal getSolde() { 
    	return solde; }
    
    public void setSolde(BigDecimal solde) { 
    	this.solde = solde; }
}