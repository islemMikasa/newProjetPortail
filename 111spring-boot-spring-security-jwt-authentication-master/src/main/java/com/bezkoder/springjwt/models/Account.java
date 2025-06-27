package com.bezkoder.springjwt.models;

import java.math.BigDecimal;

import jakarta.persistence.*;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rib", unique = true, nullable = false)
    private String rib;

    @Column(name = "solde", nullable = false)
    private BigDecimal solde;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    public Account() {}

    public Account(String rib, BigDecimal solde) {
        this.rib = rib;
        this.solde = solde;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRib() { return rib; }
    public void setRib(String rib) { this.rib = rib; }
    public BigDecimal getSolde() { return solde; }
    public void setSolde(BigDecimal solde) { this.solde = solde; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}