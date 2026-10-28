package com.scpes.placement.dto;

import com.scpes.placement.entity.Company;

import java.util.UUID;

public record CompanyDto(
        UUID id,
        String name,
        String sector,
        String website,
        String description,
        String scpeId
) {
    public static CompanyDto from(Company c) {
        return new CompanyDto(c.getId(), c.getName(), c.getSector(), c.getWebsite(), c.getDescription(), c.getScpeId());
    }
}
