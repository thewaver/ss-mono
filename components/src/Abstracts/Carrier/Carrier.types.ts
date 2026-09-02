import type { Point2d } from "@thewaver/ss-utils";

export type CarryDir = "row" | "column";

export type CarryMode = "drag" | "tap" | "key";

export type CarryEndReason = "drop" | "cancel";

export type CarryPlace = NonNullable<unknown>;

export type CarryNudge = {
    x?: number;
    y?: number;
    turn?: number;
};

export type Carry = {
    groupId: string;
    key: string;
    label: string;
    value: unknown;
};

export type CarryOrigin = {
    label: string;
    place: CarryPlace;
};

export type CarrierZone = {
    getGroupId: () => string;
    getLabel: () => string;
    getRootRef: () => HTMLElement | undefined;
    getIsDisabled: () => boolean;
    getKeyHint: (hasOtherZones: boolean) => string;
    computeCanAccept: (carry: Carry) => boolean;
    computePlaceAtPoint: (point: Point2d, carry: Carry) => CarryPlace | undefined;
    computeNudgedPlace: (place: CarryPlace, nudge: CarryNudge, carry: Carry) => CarryPlace | undefined;
    computeEntryPlace: (carry: Carry) => CarryPlace;
    computeIsSamePlace: (a: CarryPlace, b: CarryPlace) => boolean;
    computeIsPlaceAllowed: (place: CarryPlace, carry: Carry) => boolean;
    computePlaceLabel: (place: CarryPlace, carry: Carry) => string;
    takeAt: (place: CarryPlace, carry: Carry) => void;
    putAt: (place: CarryPlace, carry: Carry, origin: CarryOrigin) => void;
    moveAt: (fromPlace: CarryPlace, toPlace: CarryPlace, carry: Carry) => void;
};
