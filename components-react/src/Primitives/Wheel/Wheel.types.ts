import type { ReactNode } from "react";

import type {
    BaseDrumWheelProps,
    BaseOverheadWheelProps,
    BaseWheelProps,
    RotatorPhase,
    WheelWedgeState,
} from "@thewaver/ss-components";

export type WheelController = {
    /** Which wedge is at the marker right now, which moves while the wheel turns. */
    getCurrentIndex: () => number;
    /** What the wheel is doing: still, spinning, settling or idling. */
    getPhase: () => RotatorPhase;
    /** Whether a spin can be started right now. */
    getIsSpinnable: () => boolean;
    /** Whether the wheel is turning on its own rather than because somebody asked. */
    getIsAutoSpinning: () => boolean;
    /** Whether the turn under way was started by a spin rather than by the idle drift. */
    getIsUserSpinning: () => boolean;
    /** Starts a spin and reports whether it did. It declines while one is already under way. */
    spin: () => boolean;
    /**
     * Calls `listener` whenever anything the getters report has changed, until the returned function is called. The
     * getters answer with what the wheel last drew, so this and one getter are what `useSyncExternalStore` takes —
     * which is how a consumer's own control re-renders as the wheel becomes spinnable again.
     */
    subscribe: (listener: () => void) => () => void;
};

export type WheelSlots<T> = {
    /**
     * Which wedge the wheel is heading for. Changing it turns the wheel to that wedge, unless a spin is already
     * under way, in which case the change is ignored. It is not the only thing that moves the wheel: a spin
     * does too, and so does the wheel's own turning between spins, which leaves this holding the wedge it last
     * landed on. The wheel writes it as soon as a spin's target is known rather than when the spin lands — so
     * a consumer reading it mid-spin learns the outcome early. Read `onSpinEnd` instead to find out only once
     * it arrives, and `onSelectedWedgeChange` for the wedge at the marker right now.
     */
    targetIndex?: readonly [number, (value: number) => void];
    /** Whether the wheel is turning on its own. It is the only thing that starts or stops it. */
    autoSpin?: readonly [boolean, (value: boolean) => void];
    /** Draws one wedge. It is handed where the wedge stands relative to the marker. */
    renderWedge: (wedge: T, state: WheelWedgeState) => ReactNode;
    /** Hands the consumer a controller once the wheel is up, for spinning it from outside. */
    onMount?: (controller: WheelController) => void;
};

export type WheelProps<T> = BaseWheelProps<T> &
    WheelSlots<T> & {
        /** Draws the back of a wedge, for a look where wedges turn over. */
        renderWedgeBack?: (wedge: T, state: WheelWedgeState) => ReactNode;
    };

export type OverheadWheelProps<T> = BaseOverheadWheelProps<T> & WheelSlots<T>;

export type DrumWheelProps<T> = BaseDrumWheelProps<T> &
    WheelSlots<T> & {
        /** Draws the back of a wedge, for a look where wedges turn over. */
        renderWedgeBack: (wedge: T, state: WheelWedgeState) => ReactNode;
    };
