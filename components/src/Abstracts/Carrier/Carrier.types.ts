import type { Point2d } from "@thewaver/ss-utils";

export type CarryOrientation = "horizontal" | "vertical";

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

export type CarrierAnnouncements = {
    /**
     * What is said when an item is picked up by pointer or by tap.
     *
     * @param itemLabel The carried item's name.
     * @param zoneLabel The name of the zone it was picked up from.
     */
    computePickedUp: (itemLabel: string, zoneLabel: string) => string;
    /**
     * What is said when an item is picked up from the keyboard, which is also where the keys that move it are
     * explained, since a keyboard user cannot see where it could go.
     *
     * @param itemLabel The carried item's name.
     * @param zoneLabel The name of the zone it was picked up from.
     * @param placeLabel Where in that zone it sits, as the zone words it.
     * @param keyHint Which keys move, drop and cancel it, as the zone words it.
     */
    computePickedUpByKey: (itemLabel: string, zoneLabel: string, placeLabel: string, keyHint: string) => string;
    /**
     * What is said when an arrow key moves the carried item to a new place inside the zone it is already in.
     *
     * @param placeLabel The new place, as the zone words it. It arrives as the zone wrote it, so capitalizing it
     * to open a sentence is this function's job.
     * @param zoneLabel The zone's name.
     */
    computeAimed: (placeLabel: string, zoneLabel: string) => string;
    /**
     * What is said when the carried item is moved from the keyboard into a different zone.
     *
     * @param zoneLabel The name of the zone it moved into.
     * @param placeLabel Where in that zone it would land, as the zone words it.
     */
    computeZoneEntered: (zoneLabel: string, placeLabel: string) => string;
    /**
     * What is said when a carry is canceled and the item goes back where it came from.
     *
     * @param itemLabel The carried item's name.
     * @param zoneLabel The name of the zone it returned to.
     */
    computeReturned: (itemLabel: string, zoneLabel: string) => string;
    /**
     * What is said when an item is dropped on the place it started from, so nothing moved.
     *
     * @param itemLabel The carried item's name.
     */
    computeLeftInPlace: (itemLabel: string) => string;
    /**
     * What is said when the place aimed at will not take the item, so the drop is refused and the item goes back.
     *
     * @param itemLabel The carried item's name.
     * @param toZoneLabel The name of the zone that refused it.
     * @param fromZoneLabel The name of the zone it returned to.
     */
    computeRefused: (itemLabel: string, toZoneLabel: string, fromZoneLabel: string) => string;
    /**
     * What is said when a drop goes through.
     *
     * @param itemLabel The carried item's name.
     * @param zoneLabel The name of the zone it landed in.
     * @param placeLabel Where in that zone it landed, as the zone words it.
     */
    computeDropped: (itemLabel: string, zoneLabel: string, placeLabel: string) => string;
};

export type CarrierZone = {
    getGroupId: () => string;
    getLabel: () => string;
    getRootRef: () => HTMLElement | undefined;
    getIsDisabled: () => boolean;
    getKeyHint: (hasOtherZones: boolean) => string;
    getAnnouncements: () => CarrierAnnouncements;
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
