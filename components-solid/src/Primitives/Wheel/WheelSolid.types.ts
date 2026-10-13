import type { Accessor, JSX } from "solid-js";

import type {
    BaseDrumWheelCbs,
    BaseDrumWheelValues,
    BaseOverheadWheelCbs,
    BaseOverheadWheelValues,
    BaseWheelCbs,
    BaseWheelValues,
    RotatorPhase,
    WheelWedgeState,
} from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../Utils/typeUtils";

export type WheelController = {
    /** Which wedge is at the marker right now, which moves while the wheel turns. */
    getCurrentIndex: Accessor<number>;
    /** What the wheel is doing: still, spinning, settling or idling. */
    getPhase: Accessor<RotatorPhase>;
    /** Whether a spin can be started right now. */
    getIsSpinnable: Accessor<boolean>;
    /** Whether the wheel is turning on its own rather than because somebody asked. */
    getIsAutoSpinning: Accessor<boolean>;
    /** Whether the turn under way was started by a spin rather than by the idle drift. */
    getIsUserSpinning: Accessor<boolean>;
    /** Starts a spin and reports whether it did. It declines while one is already under way. */
    spin: () => boolean;
};

export type WheelSlots<T> = {
    /**
     * Which wedge the wheel is heading for. Writing it turns the wheel to that wedge, unless a spin is already
     * under way, in which case the write is ignored. It is not the only thing that moves the wheel: a spin
     * does too, and so does the wheel's own turning between spins, which leaves this holding the wedge it last
     * landed on. The wheel writes it as soon as a spin's target is known rather than when the spin lands — so
     * a consumer reading it mid-spin learns the outcome early. Read `onSpinEnd` instead to find out only once
     * it arrives, and `onSelectedWedgeChange` for the wedge at the marker right now.
     */
    targetIndex?: SignalSource<number>;
    /** Whether the wheel is turning on its own. It is the only thing that starts or stops it. */
    autoSpin?: SignalSource<boolean>;
    /** Draws one wedge. It is handed where the wedge stands relative to the marker. */
    renderWedge: (getWedge: Accessor<T>, getState: Accessor<WheelWedgeState>) => JSX.Element;
    /** Hands the consumer a controller once the wheel is up, for spinning it from outside. */
    onMount?: (controller: WheelController) => void;
};

export type WheelProps<T> = AccessorValues<BaseWheelValues<T>> &
    BaseWheelCbs &
    WheelSlots<T> & {
        /** Draws the back of a wedge, for a look where wedges turn over. */
        renderWedgeBack?: (getWedge: Accessor<T>, getState: Accessor<WheelWedgeState>) => JSX.Element;
    };

export type OverheadWheelProps<T> = AccessorValues<BaseOverheadWheelValues<T>> & BaseOverheadWheelCbs & WheelSlots<T>;

export type DrumWheelProps<T> = AccessorValues<BaseDrumWheelValues<T>> &
    BaseDrumWheelCbs &
    WheelSlots<T> & {
        /** Draws the back of a wedge, for a look where wedges turn over. */
        renderWedgeBack: (getWedge: Accessor<T>, getState: Accessor<WheelWedgeState>) => JSX.Element;
    };
