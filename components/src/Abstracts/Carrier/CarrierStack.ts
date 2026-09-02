import { batch, createSignal, onCleanup } from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import { LiveAnnouncer } from "../LiveAnnouncer/LiveAnnouncer";
import type { CarrierZone, Carry, CarryEndReason, CarryMode, CarryNudge, CarryPlace } from "./Carrier.types";

type CarryState = {
    carry: Carry;
    from: CarrierZone;
    fromPlace: CarryPlace;
    to: CarrierZone;
    toPlace: CarryPlace;
    mode: CarryMode;
};

const DRAG_SLOP_PX = 4;

const zones: CarrierZone[] = [];

const [getCarryState, setCarryState] = createSignal<CarryState | undefined>();

const startSentence = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const getGroupZones = (groupId: string) =>
    zones.filter((zone) => zone.getGroupId() === groupId && !zone.getIsDisabled());

const getAcceptingZones = (state: CarryState) =>
    getGroupZones(state.carry.groupId).filter((zone) => zone === state.from || zone.computeCanAccept(state.carry));

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

export namespace CarrierStack {
    export const registerZone = (zone: CarrierZone) => {
        zones.push(zone);

        onCleanup(() => {
            const index = zones.indexOf(zone);

            if (index >= 0) zones.splice(index, 1);
        });
    };

    export const getCarry = () => getCarryState()?.carry;

    export const getCarryMode = () => getCarryState()?.mode;

    export const getSourceZone = () => getCarryState()?.from;

    export const getTargetZone = () => getCarryState()?.to;

    export const getSourcePlace = () => getCarryState()?.fromPlace;

    export const getTargetPlace = () => getCarryState()?.toPlace;

    export const getIsTargetAllowed = () => {
        const state = getCarryState();

        return state === undefined || state.to.computeIsPlaceAllowed(state.toPlace, state.carry);
    };

    export const start = (from: CarrierZone, place: CarryPlace, carry: Carry, mode: CarryMode) => {
        const state: CarryState = { carry, from, fromPlace: place, to: from, toPlace: place, mode };

        setCarryState(state);

        if (mode !== "key") {
            LiveAnnouncer.announce(`${carry.label} picked up from ${from.getLabel()}.`);

            return;
        }

        LiveAnnouncer.announce(
            `${carry.label} picked up from ${from.getLabel()}, ${from.computePlaceLabel(place, carry)}. ${from.getKeyHint(getAcceptingZones(state).length > 1)}`,
        );
    };

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

    export const aimAtNudge = (nudge: CarryNudge) => {
        const state = getCarryState();

        if (!state) return;

        const place = state.to.computeNudgedPlace(state.toPlace, nudge, state.carry);

        if (place === undefined || state.to.computeIsSamePlace(place, state.toPlace)) return;

        setCarryState({ ...state, toPlace: place });

        LiveAnnouncer.announce(
            `${startSentence(state.to.computePlaceLabel(place, state.carry))} in ${state.to.getLabel()}.`,
        );
    };

    export const aimAtNextZone = (step: number) => {
        const state = getCarryState();

        if (!state) return;

        const accepting = getAcceptingZones(state);

        if (accepting.length < 2) return;

        const from = accepting.indexOf(state.to);
        const to = accepting[(((from + step) % accepting.length) + accepting.length) % accepting.length];
        const place = to.computeEntryPlace(state.carry);

        setCarryState({ ...state, to, toPlace: place });

        LiveAnnouncer.announce(`${to.getLabel()}, ${to.computePlaceLabel(place, state.carry)}.`);
    };

    export const end = (reason: CarryEndReason) => {
        const state = getCarryState();

        setCarryState(undefined);

        if (!state) return;

        if (reason === "cancel") {
            LiveAnnouncer.announce(`${state.carry.label} returned to ${state.from.getLabel()}.`);

            return;
        }

        const isSameZone = state.to === state.from;

        if (isSameZone && state.to.computeIsSamePlace(state.toPlace, state.fromPlace)) {
            LiveAnnouncer.announce(`${state.carry.label} left where it was.`);

            return;
        }

        if (!state.to.computeIsPlaceAllowed(state.toPlace, state.carry)) {
            LiveAnnouncer.announce(
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

        LiveAnnouncer.announce(
            `${state.carry.label} dropped in ${state.to.getLabel()}, ${state.to.computePlaceLabel(state.toPlace, state.carry)}.`,
        );
    };

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
