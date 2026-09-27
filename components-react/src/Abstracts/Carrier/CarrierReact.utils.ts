import { useEffect, useState } from "react";

import { CarrierUtils, type CarrierZone } from "@thewaver/ss-components";

import { useLatest } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";

/**
 * The React side of `CarrierUtils`: the carry in flight read as state, and zones registered while mounted.
 *
 * Starting, aiming and ending a carry are framework-free and called on `CarrierUtils` directly. React batches the
 * two writes of a move between zones on its own, so `CarrierUtils.end` needs no `batch` here.
 */
export namespace CarrierReactUtils {
    /**
     * The carry in flight, re-rendering whenever it moves.
     *
     * @returns The item, its source and target zones and places, and how it was begun, or `undefined` while nothing
     * is being carried.
     */
    export const useCarry = () => useStore(CarrierUtils.carry);

    /**
     * Whether dropping right now would be accepted.
     *
     * `CarrierUtils.getIsTargetAllowed`, worked out again whenever the carry moves. `true` when nothing is being
     * carried.
     */
    export const useIsTargetAllowed = () => useStore(CarrierUtils.carry, () => CarrierUtils.getIsTargetAllowed());

    /**
     * Makes a zone visible to carries for as long as the component is mounted.
     *
     * The zone is asked its questions through this render's answers, so the object can be built inline.
     *
     * @param zone The zone's own answers about its contents, places and how to change them.
     */
    export const useZone = (zone: CarrierZone) => {
        const latest = useLatest(zone);

        const [stableZone] = useState<CarrierZone>(() => ({
            getGroupId: () => latest.current.getGroupId(),
            getLabel: () => latest.current.getLabel(),
            getRootRef: () => latest.current.getRootRef(),
            getIsDisabled: () => latest.current.getIsDisabled(),
            getKeyHint: (hasOtherZones) => latest.current.getKeyHint(hasOtherZones),
            getAnnouncements: () => latest.current.getAnnouncements(),
            computeCanAccept: (carry) => latest.current.computeCanAccept(carry),
            computePlaceAtPoint: (point, carry) => latest.current.computePlaceAtPoint(point, carry),
            computeNudgedPlace: (place, nudge, carry) => latest.current.computeNudgedPlace(place, nudge, carry),
            computeEntryPlace: (carry) => latest.current.computeEntryPlace(carry),
            computeIsSamePlace: (a, b) => latest.current.computeIsSamePlace(a, b),
            computeIsPlaceAllowed: (place, carry) => latest.current.computeIsPlaceAllowed(place, carry),
            computePlaceLabel: (place, carry) => latest.current.computePlaceLabel(place, carry),
            takeAt: (place, carry) => latest.current.takeAt(place, carry),
            putAt: (place, carry, origin) => latest.current.putAt(place, carry, origin),
            moveAt: (fromPlace, toPlace, carry) => latest.current.moveAt(fromPlace, toPlace, carry),
        }));

        useEffect(() => CarrierUtils.addZone(stableZone), [stableZone]);

        return stableZone;
    };
}
