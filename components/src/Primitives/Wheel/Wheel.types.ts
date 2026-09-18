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
    index: number;
    wedgeCount: number;
    face: WheelFace;
    isSelected: boolean;
    angle: number;
    placement?: PlacementRect;
};

export type WheelController = {
    getIndex: Accessor<number>;
    getPhase: Accessor<RotatorPhase>;
    getIsSpinnable: Accessor<boolean>;
    getIsAutoSpinning: Accessor<boolean>;
    getIsUserSpinning: Accessor<boolean>;
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
    /** Names one wedge for assistive technology, and is told how many there are so it can say third of five. */
    computeWedgeLabel?: (index: number, wedgeCount: number) => string;
};

export type WheelSlots<T> = {
    /** The wedges, in the order they sit round the wheel. */
    wedges: MaybeAccessor<T[]>;
    /** How long the wheel waits between steps while turning on its own. Leave it out and it stands still until spun. */
    idleDelayMs?: MaybeAccessor<number | undefined>;
    /** Which wedge is at the marker. It is the only thing that moves the wheel. */
    indexSignal?: SignalSource<number>;
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
