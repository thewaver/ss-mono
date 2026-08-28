import { batch, createSignal, onCleanup } from "solid-js";

import { LiveAnnouncer } from "../../Abstracts/LiveAnnouncer/LiveAnnouncer";
import type { SortableCarry, SortableCarryMode, SortableEndReason, SortableZone } from "./Sortable.types";
import { SortableUtils } from "./Sortable.utils";

type CarryState = {
    carry: SortableCarry;
    from: SortableZone;
    fromIndex: number;
    to: SortableZone;
    toIndex: number;
    mode: SortableCarryMode;
};

const zones: SortableZone[] = [];

const [getCarryState, setCarryState] = createSignal<CarryState | undefined>();

const getGroupZones = (groupId: string) =>
    zones.filter((zone) => zone.getGroupId() === groupId && !zone.getIsDisabled());

const computePlaceCount = (state: CarryState, zone: SortableZone) =>
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

export namespace SortableStack {
    export const registerZone = (zone: SortableZone) => {
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

    export const start = (from: SortableZone, fromIndex: number, carry: SortableCarry, mode: SortableCarryMode) => {
        setCarryState({ carry, from, fromIndex, to: from, toIndex: fromIndex, mode });

        LiveAnnouncer.announce(
            mode === "key"
                ? `${carry.label} picked up from ${from.getLabel()}, position ${fromIndex + 1} of ${from.getLength()}. Arrow keys choose a place, Tab changes list, Enter drops, Escape cancels.`
                : `${carry.label} picked up from ${from.getLabel()}.`,
        );
    };

    export const aimAtPoint = (x: number, y: number) => {
        const state = getCarryState();

        if (!state) return;

        const zone = findZoneAt(x, y, state.carry.groupId);

        if (!zone || (zone !== state.from && !zone.computeCanAccept(state.carry))) return;

        const dropIndex = SortableUtils.computeDropIndex(zone.getItemRects(), x, y, zone.getDir());
        const toIndex = SortableUtils.computeSettledIndex(dropIndex, state.fromIndex, zone === state.from);

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

    export const end = (reason: SortableEndReason) => {
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
}
