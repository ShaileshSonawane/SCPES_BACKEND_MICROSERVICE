package com.scpes.placement.dto;

import java.time.LocalDate;

public record CreateRoundRequest(
        int roundNo,
        String type,
        LocalDate date
) {}
