import { batch, createSignal, onCleanup } from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import { LiveAnnouncer } from "../LiveAnnouncer/LiveAnnouncer";
import type { CarrierZone, Carry, CarryEndReason, CarryMode } from "./Carrier.types";
import { CarrierUtils } from "./Carrier.utils";

type CarryState = {
    carry: Carry;
    from: CarrierZone;
    fromIndex: number;
    to: CarrierZone;
    toIndex: number;
    mode: CarryMode;
};

const DRAG_SLOP_PX = 4;

const zones: CarrierZone[] = [];

const [getCarryState, setCarryState] = createSignal<CarryState | undefined>();

const getGroupZones = (groupId: string) =>
    zones.filter((zone) => zone.getGroupId() === groupId && !zone.getIsDisabled());

const computePlaceCount = (state: CarryState, zone: CarrierZone) =>
    zone === state.from ? zone.getLength() : zone.getLength() + 1;

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

    export const getTargetIndex = () => getCarryState()?.toIndex;

    export const getSourceIndex = () => getCarryState()?.fromIndex;

    export const start = (from: CarrierZone, fromIndex: number, carry: Carry, mode: CarryMode) => {
        setCarryState({ carry, from, fromIndex, to: from, toIndex: fromIndex, mode });

        if (mode !== "key") {
            LiveAnnouncer.announce(`${carry.label} picked up from ${from.getLabel()}.`);

            return;
        }

        const hasOtherZones =
            getAcceptingZones({ carry, from, fromIndex, to: from, toIndex: fromIndex, mode }).length > 1;
        const keys = hasOtherZones
            ? "Arrow keys choose a place, Tab changes list, Enter drops, Escape cancels."
            : "Arrow keys choose a place, Enter drops, Escape cancels.";

        LiveAnnouncer.announce(
            `${carry.label} picked up from ${from.getLabel()}, position ${fromIndex + 1} of ${from.getLength()}. ${keys}`,
        );
    };

    export const aimAtPoint = (x: number, y: number) => {
        const state = getCarryState();

        if (!state) return;

        const zone = findZoneAt(x, y, state.carry.groupId);

        if (!zone || (zone !== state.from && !zone.computeCanAccept(state.carry))) return;

        const dropIndex = CarrierUtils.computeDropIndex(zone.getItemRects(), x, y, zone.getDir());
        const toIndex = CarrierUtils.computeSettledIndex(dropIndex, state.fromIndex, zone === state.from);

        if (zone === state.to && toIndex === state.toIndex) return;

        setCarryState({ ...state, to: zone, toIndex });
    };

    export const aimAtIndex = (step: number) => {
        const state = getCarryState();

        if (!state) return;

        const places = computePlaceCount(state, state.to);
        const toIndex = Math.min(Math.max(state.toIndex + step, 0), places - 1);

        if (toIndex === state.toIndex) return;

        setCarryState({ ...state, toIndex });

        LiveAnnouncer.announce(`Place ${toIndex + 1} of ${places} in ${state.to.getLabel()}.`);
    };

    export const aimAtNextZone = (step: number) => {
        const state = getCarryState();

        if (!state) return;

        const accepting = getAcceptingZones(state);

        if (accepting.length < 2) return;

        const from = accepting.indexOf(state.to);
        const to = accepting[(((from + step) % accepting.length) + accepting.length) % accepting.length];
        const toIndex = to === state.from ? state.fromIndex : to.getLength();

        setCarryState({ ...state, to, toIndex });

        LiveAnnouncer.announce(`${to.getLabel()}, place ${toIndex + 1} of ${computePlaceCount(state, to)}.`);
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

        if (isSameZone && state.toIndex === state.fromIndex) {
            LiveAnnouncer.announce(`${state.carry.label} left where it was.`);

            return;
        }

        if (isSameZone) {
            state.to.moveAt(state.fromIndex, state.toIndex);
        } else {
            batch(() => {
                state.from.takeAt(state.fromIndex);
                state.to.putAt(state.toIndex, state.carry, { label: state.from.getLabel(), index: state.fromIndex });
            });
        }

        LiveAnnouncer.announce(
            `${state.carry.label} dropped in ${state.to.getLabel()}, place ${state.toIndex + 1} of ${state.to.getLength()}.`,
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
