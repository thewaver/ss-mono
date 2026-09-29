import { untrack } from "svelte";

import { CarrierUtils, type CarrierZone } from "@thewaver/ss-components";

import { readStore } from "../../Utils/storeUtils.js";

const getCarryState = readStore(CarrierUtils.carry);

/**
 * The Svelte side of {@link CarrierUtils}: the carry in flight read reactively, and zones registered for a
 * component's lifetime. Starting, aiming and ending a carry are framework-free and called on {@link CarrierUtils}
 * directly; Svelte applies the two writes of a move between zones together on its own, so `CarrierUtils.end` needs
 * no `batch`.
 */
export namespace CarrierSvelteUtils {
    /**
     * Makes a zone visible to carries for as long as the calling component lives.
     *
     * Call this once, while the component is being set up; the zone is unregistered when the component is
     * destroyed, so a removed list stops being a drop target on its own. The zone's answers are asked for when a
     * carry needs them, so functions reading the component's props always see the current ones.
     *
     * @param zone The zone's own answers about its contents, places and how to change them.
     */
    export const registerZone = (zone: CarrierZone) => {
        $effect(() => untrack(() => CarrierUtils.addZone(zone)));
    };

    /** The item currently being carried, or `undefined` when nothing is in flight. Reactive. */
    export const getCarry = () => getCarryState()?.carry;

    /** How the carry in flight was begun — by drag, by tap or by keyboard. Reactive. */
    export const getCarryMode = () => getCarryState()?.mode;

    /** The zone the carry in flight started in. Reactive. */
    export const getSourceZone = () => getCarryState()?.from;

    /** The zone the carry in flight is currently aimed at, which may be the source. Reactive. */
    export const getTargetZone = () => getCarryState()?.to;

    /** The place the carry in flight started from. Reactive. */
    export const getSourcePlace = () => getCarryState()?.fromPlace;

    /** The place the carry in flight is currently aimed at. Reactive. */
    export const getTargetPlace = () => getCarryState()?.toPlace;

    /**
     * Whether dropping right now would be accepted.
     *
     * {@link CarrierUtils.getIsTargetAllowed}, read again whenever the carry moves when it is read inside an effect,
     * a `$derived` or markup. `true` when nothing is being carried.
     */
    export const getIsTargetAllowed = () => {
        getCarryState();

        return CarrierUtils.getIsTargetAllowed();
    };
}
