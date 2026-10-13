package com.scpes.placement.entity;

public enum DriveStatus {
    DRAFT,
    OPEN,
    CLOSED,
    RESULT_PUBLISHED;

    public boolean canMoveTo(DriveStatus next) {
        return switch (this) {
            case DRAFT -> next == OPEN;
            case OPEN -> next == CLOSED || next == RESULT_PUBLISHED;
            case CLOSED -> next == RESULT_PUBLISHED;
            case RESULT_PUBLISHED -> false;
        };
    }
}
