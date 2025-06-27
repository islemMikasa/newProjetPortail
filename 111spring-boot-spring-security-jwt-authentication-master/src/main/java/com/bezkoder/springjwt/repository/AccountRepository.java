package com.bezkoder.springjwt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bezkoder.springjwt.models.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByRib(String rib);
}