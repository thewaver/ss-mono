import type { Accessor, JSX } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import type { PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type { RotatorPhase, RotatorSpinDefs } from "../../Abstracts/Rotator/Rotator.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";
import type { BarrelAxis, BarrelFace } from "../Barrel/Barrel.types";

export type WheelVariant = "overhead" | "drum";

export type WheelAxis = BarrelAxis;

export type WheelFace = BarrelFace;

export type WheelWedgeState = {
    /** Which wedge this is, counting from zero. */
    index: number;
    /** How many wedges the wheel has. */
    wedgeCount: number;
    /** Which side of the wedge is being drawn, since a wedge turned past the axis shows its back. */
    face: WheelFace;
    /** Whether this wedge is the one at the marker. */
    isSelected: boolean;
    /** How far round this wedge sits, in degrees. */
    angle: number;
    /** Where the wedge sits, for an overhead wheel that lays its wedges out rather than turning a drum. */
    placement?: PlacementRect;
};

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
    /** Starts a spin. Does nothing while one is already under way. */
    spin: () => void;
};

export type WheelState = {
    /** Names the wheel for assistive technology. */
    ariaLabel: string;
    /** Turns the wheel off, so it can neither be spun nor turn by itself. */
    isDisabled?: boolean;
    /** How long a spin takes from the moment it starts to the moment it stops. */
    spinDurationMs?: number;
    /** How long the wheel takes to ease into its final position once the spin is over. */
    settleDurationMs?: number;
    /** How long the wheel stands still after a spin before it starts turning again. */
    restDurationMs?: number;
};

export type WheelLabels = {
    /**
     * Names one wedge for assistive technology, and is told how many there are so it can say third of five.
     * The index is zero-based, matching `renderWedge`.
     */
    computeWedgeLabel?: (index: number, wedgeCount: number) => string;
};

export type WheelSlots<T> = {
    /** The wedges, in the order they sit round the wheel. */
    wedges: MaybeAccessor<T[]>;
    /** How long the wheel waits between steps while turning on its own. Leave it out and it stands still until spun. */
    idleDelayMs?: MaybeAccessor<number | undefined>;
    /**
     * Which wedge the wheel is heading for. It is the only thing that moves the wheel: writing it turns the
     * wheel to that wedge, and the wheel writes it as soon as a spin's target is known rather than when the
     * spin lands — so a consumer reading it mid-spin learns the outcome early. Read `onSpinEnd` instead to
     * find out only once it arrives, and `onSelectedWedgeChange` for the wedge at the marker right now.
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
