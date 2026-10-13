package com.scpes.placement.entity;

public enum ApplicationStatus {
    APPLIED,
    SHORTLISTED,
    SELECTED,
    REJECTED,
    ON_HOLD;

    public boolean canMoveTo(ApplicationStatus next) {
        return switch (this) {
            case APPLIED -> next == SHORTLISTED || next == REJECTED;
            case SHORTLISTED -> next == SELECTED || next == REJECTED || next == ON_HOLD;
            case ON_HOLD -> next == SELECTED || next == REJECTED;
            case SELECTED, REJECTED -> false;
        };
    }
}
