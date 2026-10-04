import type { VNodeChild } from "vue";

import type {
    PlacementLayoutFn,
    PointSource,
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
};

export type WheelContentProps<T> = {
    /** The wedges, in the order they sit round the wheel. */
    "wedges": T[];
    /** How long the wheel waits between steps while turning on its own. Leave it out and it stands still until spun. */
    "idleDelayMs"?: number;
    /**
     * Which wedge the wheel is heading for. Changing it turns the wheel to that wedge, unless a spin is already
     * under way, in which case the change is ignored. It is not the only thing that moves the wheel: a spin
     * does too, and so does the wheel's own turning between spins, which leaves this holding the wedge it last
     * landed on. The wheel writes it as soon as a spin's target is known rather than when the spin lands — so
     * a consumer reading it mid-spin learns the outcome early. Read `onSpinEnd` instead to find out only once
     * it arrives, and `onSelectedWedgeChange` for the wedge at the marker right now.
     */
    "targetIndex"?: number;
    /**
     * Receives the wedge the wheel is heading for as soon as it is known, which is what `v-model:targetIndex` binds.
     */
    "onUpdate:targetIndex"?: (index: number) => void;
    /** Whether the wheel is turning on its own. It is the only thing that starts or stops it. */
    "autoSpin"?: boolean;
    /** Receives the wheel starting or stopping its own turning, which is what `v-model:autoSpin` binds. */
    "onUpdate:autoSpin"?: (isAutoSpinning: boolean) => void;
    /** Chooses which wedge a spin should land on. It may answer later, so the result can come from a server. */
    "computeSpinTarget": () => number | Promise<number>;
    /** How a spin to a given wedge should run — how many turns, and on what curve. */
    "computeSpinDefs"?: (index: number, wedgeCount: number) => RotatorSpinDefs;
    /** Runs when a different wedge reaches the marker, including while the wheel is still turning. */
    "onSelectedWedgeChange"?: (index: number) => void;
    /** Runs once a spin has finished and settled. */
    "onSpinEnd"?: (index: number) => void;
    /**
     * Hands the consumer a controller once the wheel is up, for spinning it from outside. Its getters read the
     * wheel's reactive state, so a template or a `computed` calling one follows it.
     */
    "onMount"?: (controller: WheelController) => void;
};

export type WheelSlots<T> = {
    /** Draws one wedge. It is handed where the wedge stands relative to the marker. */
    renderWedge: (props: { wedge: T; state: WheelWedgeState }) => VNodeChild;
};

export type WheelBackSlot<T> = {
    /** Draws the back of a wedge, for a look where wedges turn over. */
    renderWedgeBack: (props: { wedge: T; state: WheelWedgeState }) => VNodeChild;
};

export type WheelProps<T> = WheelState &
    WheelLabels &
    WheelContentProps<T> & {
        /** Which of the wheel's looks this is. */
        variant: WheelVariant;
        /** Which way round the wheel turns. */
        axis?: WheelAxis;
        /** How large one wedge is. */
        wedgeSize?: Size2d;
        /** Where the marker sits, in degrees, which is the point a spin lands a wedge on. */
        markerDegrees?: number;
        /**
         * The point to follow instead of the pointer.
         *
         * A fraction across a box — the wheel's own, or the element named in the source — so a light moving across a
         * banner can be handed to every card under it and each answers to the same spot. While the source has no point
         * every wedge rests, as it does when the pointer leaves the window. Left out, the pointer is followed.
         */
        pointSource?: PointSource;
        /** Arranges the wedges, for a wheel that is something other than an even ring. */
        computeLayout?: PlacementLayoutFn;
        /** What the wedges do as the pointer nears them. */
        computeEffect?: ProximityEffectFn;
    };

export type OverheadWheelProps<T> = WheelState &
    WheelLabels &
    WheelContentProps<T> & {
        /** Where the marker sits, in degrees, which is the point a spin lands a wedge on. */
        markerDegrees?: number;
        /**
         * The point to follow instead of the pointer.
         *
         * A fraction across a box — the wheel's own, or the element named in the source — so a light moving across a
         * banner can be handed to every card under it and each answers to the same spot. While the source has no point
         * every wedge rests, as it does when the pointer leaves the window. Left out, the pointer is followed.
         */
        pointSource?: PointSource;
        /** Arranges the wedges, for a wheel that is something other than an even ring. */
        computeLayout?: PlacementLayoutFn;
        /** What the wedges do as the pointer nears them. */
        computeEffect?: ProximityEffectFn;
    };

export type DrumWheelProps<T> = WheelState &
    WheelLabels &
    WheelContentProps<T> & {
        /** Which way round the wheel turns. */
        axis?: WheelAxis;
        /** How large one wedge is. */
        wedgeSize: Size2d;
    };

export type DrumWheelSlots<T> = WheelSlots<T> & WheelBackSlot<T>;
