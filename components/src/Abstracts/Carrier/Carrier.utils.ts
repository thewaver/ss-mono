import { batch, createSignal, onCleanup } from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import { LiveAnnouncerUtils } from "../LiveAnnouncer/LiveAnnouncer.utils";
import type { CarrierZone, Carry, CarryDir, CarryEndReason, CarryMode, CarryNudge, CarryPlace } from "./Carrier.types";

type CarryState = {
    carry: Carry;
    from: CarrierZone;
    fromPlace: CarryPlace;
    to: CarrierZone;
    toPlace: CarryPlace;
    mode: CarryMode;
};

/** How far the pointer must travel before a press counts as a drag rather than a click. */
const DRAG_SLOP_PX = 4;

/** Every zone currently mounted, across every group. */
const zones: CarrierZone[] = [];

const [getCarryState, setCarryState] = createSignal<CarryState | undefined>();

/** Capitalises a place label so it can open an announcement. */
const startSentence = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** The mounted, enabled zones belonging to one group. */
const getGroupZones = (groupId: string) =>
    zones.filter((zone) => zone.getGroupId() === groupId && !zone.getIsDisabled());

/** The zones the carried item could actually land in, its own source always among them. */
const getAcceptingZones = (state: CarryState) =>
    getGroupZones(state.carry.groupId).filter((zone) => zone === state.from || zone.computeCanAccept(state.carry));

/** The topmost zone of a group under a screen point, if any. */
const findZoneAt = (x: number, y: number, groupId: string) => {
    const candidates = getGroupZones(groupId);

    for (const element of document.elementsFromPoint(x, y)) {
        const zone = candidates.find((candidate) => {
            const root = candidate.getRootRef();

            return root !== undefined && (root === element || root.contains(element));
        });

        if (zone) return zone;
    }
};

/**
 * Moves an item from one place to another, by pointer, by tap or by keyboard.
 *
 * One carry is in flight at a time, held in module state, so the item being dragged, the zone it
 * came from and the place it is currently aimed at are readable from anywhere — the source list
 * greys out its own row, the target list draws an insertion marker, and neither has to know about
 * the other. Zones register themselves and answer questions about their own contents through
 * {@link CarrierZone}, which is what lets the same carry work across lists, grids and boards that
 * have nothing else in common.
 *
 * A place is whatever a zone wants it to be — an index, a pair of grid coordinates, a cell plus a
 * rotation — and is never inspected here; the zone is asked to compare, nudge, label and validate
 * its own places. Every step announces itself to a screen reader, so the keyboard route is not a
 * second-class one.
 */
export namespace CarrierUtils {
    /**
     * Finds which gap between items a point falls into.
     *
     * Each item's midpoint is the boundary: past it, the drop goes after that item rather than before
     * it. This is the ordinary insertion-marker rule for a list or a row of chips.
     *
     * @param rects The items' measured rectangles, in the order they are drawn.
     * @param x The pointer's screen position.
     * @param y The pointer's screen position.
     * @param dir Which axis the items run along.
     * @returns A gap number from `0` up to and including the item count, so `rects.length` means "after
     * everything".
     */
    export const computeDropIndex = (rects: DOMRect[], x: number, y: number, dir: CarryDir): number => {
        for (let index = 0; index < rects.length; index++) {
            const rect = rects[index];
            const middle = dir === "row" ? rect.left + rect.width * 0.5 : rect.top + rect.height * 0.5;

            if ((dir === "row" ? x : y) < middle) return index;
        }

        return rects.length;
    };

    /**
     * Corrects a drop gap for the fact that the item being moved is about to leave its old place.
     *
     * Within one list the item occupies a slot that will close up behind it, so a gap counted while it
     * was still there is one too high once it is gone. Moving from position 1 to the gap at 4 lands at
     * 3, not 4.
     *
     * @param dropIndex The gap from {@link CarrierUtils.computeDropIndex}.
     * @param fromIndex Where the item currently sits.
     * @param isSameZone `false` when the item is coming from another zone, in which case nothing closes
     * up and the gap is already right.
     * @returns The index the item will actually end up at.
     */
    export const computeSettledIndex = (dropIndex: number, fromIndex: number, isSameZone: boolean) =>
        isSameZone && dropIndex > fromIndex ? dropIndex - 1 : dropIndex;

    /**
     * Turns a settled index back into the gap to draw a marker in.
     *
     * The reverse of {@link CarrierUtils.computeSettledIndex}, needed because the marker is drawn while
     * the item is still in its old place. Without it, dropping an item just after itself draws the
     * marker just before itself, which reads as no movement at all.
     *
     * @param settledIndex Where the item will end up.
     * @param fromIndex Where it currently sits.
     * @param isSameZone `false` when it comes from another zone.
     * @returns The gap to draw the marker in.
     */
    export const computeMarkerIndex = (settledIndex: number, fromIndex: number, isSameZone: boolean) =>
        isSameZone && settledIndex >= fromIndex ? settledIndex + 1 : settledIndex;

    /**
     * Produces the reordered list, without touching the original.
     *
     * @param order The current order.
     * @param fromIndex The item to move.
     * @param toIndex Where it should end up, counted after its removal — a settled index rather than a
     * drop gap.
     * @returns A new array.
     */
    export const computeMovedOrder = <T>(order: T[], fromIndex: number, toIndex: number) => {
        const rest = order.filter((_unused, index) => index !== fromIndex);

        return [...rest.slice(0, toIndex), order[fromIndex], ...rest.slice(toIndex)];
    };

    /**
     * Makes a zone visible to carries for as long as the calling component lives.
     *
     * Call this once during setup; the zone is unregistered on cleanup, so an unmounted list stops
     * being a drop target on its own.
     *
     * @param zone The zone's own answers about its contents, places and how to change them.
     */
    export const registerZone = (zone: CarrierZone) => {
        zones.push(zone);

        onCleanup(() => {
            const index = zones.indexOf(zone);

            if (index >= 0) zones.splice(index, 1);
        });
    };

    /** The item currently being carried, or `undefined` when nothing is in flight. */
    export const getCarry = () => getCarryState()?.carry;

    /** How the carry in flight was begun — by drag, by tap or by keyboard. */
    export const getCarryMode = () => getCarryState()?.mode;

    /** The zone the carry in flight started in. */
    export const getSourceZone = () => getCarryState()?.from;

    /** The zone the carry in flight is currently aimed at, which may be the source. */
    export const getTargetZone = () => getCarryState()?.to;

    /** The place the carry in flight started from. */
    export const getSourcePlace = () => getCarryState()?.fromPlace;

    /** The place the carry in flight is currently aimed at. */
    export const getTargetPlace = () => getCarryState()?.toPlace;

    /**
     * Whether dropping right now would be accepted.
     *
     * A zone can accept the item in general and still refuse this particular place — a board cell that
     * is occupied, a shape that would hang off the edge. This is what an invalid-drop cursor or a red
     * marker keys off. Reports `true` when nothing is being carried, so a caller need not special-case
     * the idle state.
     */
    export const getIsTargetAllowed = () => {
        const state = getCarryState();

        return state === undefined || state.to.computeIsPlaceAllowed(state.toPlace, state.carry);
    };

    /**
     * Begins a carry.
     *
     * @param from The zone the item is leaving.
     * @param place Where in that zone it sits.
     * @param carry The item, its group and the label announcements use.
     * @param mode How the carry was begun. The keyboard route announces the available keys as well,
     * since its user cannot see the drop targets move.
     */
    export const start = (from: CarrierZone, place: CarryPlace, carry: Carry, mode: CarryMode) => {
        const state: CarryState = { carry, from, fromPlace: place, to: from, toPlace: place, mode };

        setCarryState(state);

        if (mode !== "key") {
            LiveAnnouncerUtils.announce(`${carry.label} picked up from ${from.getLabel()}.`);

            return;
        }

        LiveAnnouncerUtils.announce(
            `${carry.label} picked up from ${from.getLabel()}, ${from.computePlaceLabel(place, carry)}. ${from.getKeyHint(getAcceptingZones(state).length > 1)}`,
        );
    };

    /**
     * Aims the carry in flight at a screen point.
     *
     * Called on every pointer move. The topmost zone under the point that will accept the item wins;
     * when there is none, or the zone cannot turn the point into a place, the previous aim is kept
     * rather than cleared, so dragging across a gutter does not make the marker flicker. Does nothing
     * when no carry is in flight.
     *
     * @param x The pointer's screen position.
     * @param y The pointer's screen position.
     */
    export const aimAtPoint = (x: number, y: number) => {
        const state = getCarryState();

        if (!state) return;

        const zone = findZoneAt(x, y, state.carry.groupId);

        if (!zone || (zone !== state.from && !zone.computeCanAccept(state.carry))) return;

        const place = zone.computePlaceAtPoint({ x, y }, state.carry);

        if (place === undefined) return;
        if (zone === state.to && zone.computeIsSamePlace(place, state.toPlace)) return;

        setCarryState({ ...state, to: zone, toPlace: place });
    };

    /**
     * Moves the aim by one step within the zone it is already in, for the keyboard route.
     *
     * The zone decides what a step means, so an arrow key can walk a list by one row, a grid by one
     * cell, or turn a piece on the spot. Announces where the aim landed. Does nothing when the zone
     * refuses the step, which is how the ends of a list stop the cursor.
     *
     * @param nudge How far to move along each axis, and how far to turn.
     */
    export const aimAtNudge = (nudge: CarryNudge) => {
        const state = getCarryState();

        if (!state) return;

        const place = state.to.computeNudgedPlace(state.toPlace, nudge, state.carry);

        if (place === undefined || state.to.computeIsSamePlace(place, state.toPlace)) return;

        setCarryState({ ...state, toPlace: place });

        LiveAnnouncerUtils.announce(
            `${startSentence(state.to.computePlaceLabel(place, state.carry))} in ${state.to.getLabel()}.`,
        );
    };

    /**
     * Moves the aim to another zone, for the keyboard route.
     *
     * Only the zones that would accept the item are visited, wrapping round at the ends, and the new
     * zone chooses where the cursor enters it. Does nothing when the item has nowhere else to go.
     *
     * @param step `1` for the next zone, `-1` for the previous.
     */
    export const aimAtNextZone = (step: number) => {
        const state = getCarryState();

        if (!state) return;

        const accepting = getAcceptingZones(state);

        if (accepting.length < 2) return;

        const from = accepting.indexOf(state.to);
        const to = accepting[(((from + step) % accepting.length) + accepting.length) % accepting.length];
        const place = to.computeEntryPlace(state.carry);

        setCarryState({ ...state, to, toPlace: place });

        LiveAnnouncerUtils.announce(`${to.getLabel()}, ${to.computePlaceLabel(place, state.carry)}.`);
    };

    /**
     * Finishes the carry in flight, committing it or putting the item back.
     *
     * The four outcomes are all announced, because none of them is visible to a screen reader: the
     * carry was cancelled, the item did not move, the place refused it, or the move went through. A
     * move within one zone is handed to that zone's `moveAt`; a move between zones is a `takeAt` and a
     * `putAt` batched together, so consumers see one update rather than a moment with the item in
     * neither place.
     *
     * @param reason `"cancel"` returns the item; `"drop"` commits it if the target place allows it.
     */
    export const end = (reason: CarryEndReason) => {
        const state = getCarryState();

        setCarryState(undefined);

        if (!state) return;

        if (reason === "cancel") {
            LiveAnnouncerUtils.announce(`${state.carry.label} returned to ${state.from.getLabel()}.`);

            return;
        }

        const isSameZone = state.to === state.from;

        if (isSameZone && state.to.computeIsSamePlace(state.toPlace, state.fromPlace)) {
            LiveAnnouncerUtils.announce(`${state.carry.label} left where it was.`);

            return;
        }

        if (!state.to.computeIsPlaceAllowed(state.toPlace, state.carry)) {
            LiveAnnouncerUtils.announce(
                `${state.carry.label} does not fit in ${state.to.getLabel()}, returned to ${state.from.getLabel()}.`,
            );

            return;
        }

        if (isSameZone) {
            state.to.moveAt(state.fromPlace, state.toPlace, state.carry);
        } else {
            batch(() => {
                state.from.takeAt(state.fromPlace, state.carry);
                state.to.putAt(state.toPlace, state.carry, { label: state.from.getLabel(), place: state.fromPlace });
            });
        }

        LiveAnnouncerUtils.announce(
            `${state.carry.label} dropped in ${state.to.getLabel()}, ${state.to.computePlaceLabel(state.toPlace, state.carry)}.`,
        );
    };

    /**
     * Runs a pointer drag from the press that starts it to the release that ends it.
     *
     * The carry does not begin on `pointerdown` — the pointer has to travel a few pixels first, so a
     * click on a draggable item is still a click. Once it does begin, the pointer is captured, which
     * keeps the drag alive when it leaves the element or the window, and `pointercancel` is treated as
     * a cancellation rather than a drop.
     *
     * @param element The element the press landed on. Listeners are attached to it and removed when
     * the drag finishes.
     * @param e The `pointerdown` event. Only this pointer is followed, so a second finger does not
     * interfere.
     * @param onPickUp Called once, when the movement passes the threshold; this is where the caller
     * calls {@link CarrierUtils.start}. Receives the position the press began at, not the current one,
     * so a grab offset can be worked out from where the user actually took hold.
     * @param onDrop Called just before the carry ends, for a caller that needs to read its own state
     * while the carry is still in flight.
     */
    export const dragFromPointer = (
        element: HTMLElement,
        e: PointerEvent,
        onPickUp: (from: Point2d) => void,
        onDrop?: () => void,
    ) => {
        const startX = e.clientX;
        const startY = e.clientY;

        let hasStarted = false;

        const handleMove = (moveEvent: PointerEvent) => {
            if (moveEvent.pointerId !== e.pointerId) return;

            if (!hasStarted) {
                if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < DRAG_SLOP_PX) return;

                hasStarted = true;
                element.setPointerCapture(e.pointerId);
                onPickUp({ x: startX, y: startY });
            }

            moveEvent.preventDefault();
            aimAtPoint(moveEvent.clientX, moveEvent.clientY);
        };

        const handleEnd = (endEvent: PointerEvent) => {
            if (endEvent.pointerId !== e.pointerId) return;

            element.removeEventListener("pointermove", handleMove);
            element.removeEventListener("pointerup", handleEnd);
            element.removeEventListener("pointercancel", handleEnd);

            if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId);

            if (!hasStarted) return;

            onDrop?.();

            end(endEvent.type === "pointercancel" ? "cancel" : "drop");
        };

        element.addEventListener("pointermove", handleMove);
        element.addEventListener("pointerup", handleEnd);
        element.addEventListener("pointercancel", handleEnd);
    };
}
