import type { Accessor, JSX } from "solid-js";

import type {
    PlacementLayoutFn,
    ProximityEffectFn,
    RotatorPhase,
    RotatorSpinDefs,
    WheelAxis,
    WheelLabels,
    WheelState,
    WheelVariant,
    WheelWedgeState,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

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
    /** The wedges, in the order they sit round the wheel. */
    wedges: MaybeAccessor<T[]>;
    /** How long the wheel waits between steps while turning on its own. Leave it out and it stands still until spun. */
    idleDelayMs?: MaybeAccessor<number | undefined>;
    /**
     * Which wedge the wheel is heading for. Writing it turns the wheel to that wedge, unless a spin is already
     * under way, in which case the write is ignored. It is not the only thing that moves the wheel: a spin
     * does too, and so does the wheel's own turning between spins, which leaves this holding the wedge it last
     * landed on. The wheel writes it as soon as a spin's target is known rather than when the spin lands — so
     * a consumer reading it mid-spin learns the outcome early. Read `onSpinEnd` instead to find out only once
     * it arrives, and `onSelectedWedgeChange` for the wedge at the marker right now.
     */
    targetIndexSignal?: SignalSource<number>;
    /** Whether the wheel is turning on its own. It is the only thing that starts or stops it. */
    autoSpinSignal?: SignalSource<boolean>;
    /** Chooses which wedge a spin should land on. It may answer later, so the result can come from a server. */
    computeSpinTarget: () => number | Promise<number>;
    /** How a spin to a given wedge should run — how many turns, and on what curve. */
    computeSpinDefs?: (index: number, wedgeCount: number) => RotatorSpinDefs;
    /** Draws one wedge. It is handed where the wedge stands relative to the marker. */
    renderWedge: (getWedge: Accessor<T>, getState: Accessor<WheelWedgeState>) => JSX.Element;
    /** Runs when a different wedge reaches the marker, including while the wheel is still turning. */
    onSelectedWedgeChange?: (index: number) => void;
    /** Runs once a spin has finished and settled. */
    onSpinEnd?: (index: number) => void;
    /** Hands the consumer a controller once the wheel is up, for spinning it from outside. */
    onMount?: (controller: WheelController) => void;
};

export type WheelProps<T> = AccessorProps<
    WheelState &
        WheelLabels & {
            /** Which of the wheel's looks this is. */
            variant: WheelVariant;
            /** Which way round the wheel turns. */
            axis?: WheelAxis;
            /** How large one wedge is. */
            wedgeSize?: Size2d;
            /** Where the marker sits, in degrees, which is the point a spin lands a wedge on. */
            markerDegrees?: number;
        }
> &
    WheelSlots<T> & {
        /** Arranges the wedges, for a wheel that is something other than an even ring. */
        computeLayout?: PlacementLayoutFn;
        /** What the wedges do as the pointer nears them. */
        computeEffect?: ProximityEffectFn;
        /** Draws the back of a wedge, for a look where wedges turn over. */
        renderWedgeBack?: (getWedge: Accessor<T>, getState: Accessor<WheelWedgeState>) => JSX.Element;
    };

export type OverheadWheelProps<T> = AccessorProps<
    WheelState &
        WheelLabels & {
            /** Where the marker sits, in degrees, which is the point a spin lands a wedge on. */
            markerDegrees?: number;
        }
> &
    WheelSlots<T> & {
        /** Arranges the wedges, for a wheel that is something other than an even ring. */
        computeLayout?: PlacementLayoutFn;
        /** What the wedges do as the pointer nears them. */
        computeEffect?: ProximityEffectFn;
    };

export type DrumWheelProps<T> = AccessorProps<
    WheelState &
        WheelLabels & {
            /** Which way round the wheel turns. */
            axis?: WheelAxis;
            /** How large one wedge is. */
            wedgeSize: Size2d;
        }
> &
    WheelSlots<T> & {
        /** Draws the back of a wedge, for a look where wedges turn over. */
        renderWedgeBack: (getWedge: Accessor<T>, getState: Accessor<WheelWedgeState>) => JSX.Element;
    };
