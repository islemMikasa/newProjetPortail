package com.bezkoder.springjwt.payload.request;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;

public class BalanceUpdateRequest {
    @NotNull(message = "New balance cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Balance must be positive") // Adjust min value as per business rules
    private BigDecimal newBalance;

    public BigDecimal getNewBalance() {
        return newBalance;
    }

    public void setNewBalance(BigDecimal newBalance) {
        this.newBalance = newBalance;
    }
}