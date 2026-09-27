import { batch, createSignal, onCleanup } from "solid-js";

import { CarrierUtils, type CarrierZone, type CarryEndReason } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

/** The carry in flight as a signal, shared by every Solid reader for as long as the module is loaded. */
const [getCarryState, setCarryState] = createSignal(CarrierUtils.carry.get());

CarrierUtils.carry.subscribe(() => setCarryState(() => CarrierUtils.carry.get()));

/**
 * The Solid side of {@link CarrierUtils}: the carry in flight read reactively, zones registered for an owner's
 * lifetime, and moves between zones committed as one Solid update. Starting and aiming a carry are framework-free
 * and called on {@link CarrierUtils} directly.
 */
export namespace CarrierSolidUtils {
    /**
     * Makes a zone visible to carries for as long as the calling component lives.
     *
     * Call this once during setup; the zone is unregistered on cleanup, so an unmounted list stops
     * being a drop target on its own.
     *
     * @param zone The zone's own answers about its contents, places and how to change them.
     */
    export const registerZone = (zone: CarrierZone) => {
        onCleanup(CarrierUtils.addZone(zone));
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
     * {@link CarrierUtils.getIsTargetAllowed}, re-run whenever the carry moves when read inside a reactive context.
     */
    export const getIsTargetAllowed = () => {
        getCarryState();

        return CarrierUtils.getIsTargetAllowed();
    };

    /**
     * Finishes the carry in flight, committing it or putting the item back.
     *
     * {@link CarrierUtils.end} with a move between zones committed inside one Solid `batch`.
     *
     * @param reason `"cancel"` returns the item; `"drop"` commits it if the target place allows it.
     */
    export const end = (reason: CarryEndReason) => CarrierUtils.end(reason, { batch });

    /**
     * Runs a pointer drag from the press that starts it to the release that ends it.
     *
     * {@link CarrierUtils.dragFromPointer}, ending through {@link end}.
     *
     * @param element The element the press landed on.
     * @param e The `pointerdown` event.
     * @param onPickUp Called once, when the movement passes the threshold; this is where the caller
     * calls `CarrierUtils.start`.
     * @param onDrop Called just before the carry ends.
     */
    export const dragFromPointer = (
        element: HTMLElement,
        e: PointerEvent,
        onPickUp: (from: Point2d) => void,
        onDrop?: () => void,
    ) => CarrierUtils.dragFromPointer(element, e, onPickUp, onDrop, { batch });
}
