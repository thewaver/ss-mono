import { type CarrierZone } from "@thewaver/ss-components";
/**
 * The Svelte side of {@link CarrierUtils}: the carry in flight read reactively, and zones registered for a
 * component's lifetime. Starting, aiming and ending a carry are framework-free and called on {@link CarrierUtils}
 * directly; Svelte applies the two writes of a move between zones together on its own, so `CarrierUtils.end` needs
 * no `batch`.
 */
export declare namespace CarrierSvelteUtils {
    /**
     * Makes a zone visible to carries for as long as the calling component lives.
     *
     * Call this once, while the component is being set up; the zone is unregistered when the component is
     * destroyed, so a removed list stops being a drop target on its own. The zone's answers are asked for when a
     * carry needs them, so functions reading the component's props always see the current ones.
     *
     * @param zone The zone's own answers about its contents, places and how to change them.
     */
    const registerZone: (zone: CarrierZone) => void;
    /** The item currently being carried, or `undefined` when nothing is in flight. Reactive. */
    const getCarry: () => import("@thewaver/ss-components").Carry | undefined;
    /** How the carry in flight was begun — by drag, by tap or by keyboard. Reactive. */
    const getCarryMode: () => import("@thewaver/ss-components").CarryMode | undefined;
    /** The zone the carry in flight started in. Reactive. */
    const getSourceZone: () => CarrierZone | undefined;
    /** The zone the carry in flight is currently aimed at, which may be the source. Reactive. */
    const getTargetZone: () => CarrierZone | undefined;
    /** The place the carry in flight started from. Reactive. */
    const getSourcePlace: () => {} | undefined;
    /** The place the carry in flight is currently aimed at. Reactive. */
    const getTargetPlace: () => {} | undefined;
    /**
     * Whether dropping right now would be accepted.
     *
     * {@link CarrierUtils.getIsTargetAllowed}, read again whenever the carry moves when it is read inside an effect,
     * a `$derived` or markup. `true` when nothing is being carried.
     */
    const getIsTargetAllowed: () => boolean;
}
