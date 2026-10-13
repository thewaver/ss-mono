import type { Size2d } from "@thewaver/ss-utils";

import type { PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { PointSource } from "../../Abstracts/PointerTracker/PointerTracker.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type { RotatorSpinDefs } from "../../Abstracts/Rotator/Rotator.types";
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

export type BaseWheelCommonValues<T> = {
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
    /**
     * What the wheel is called when it is announced, so a reader hears wheel rather than group. Defaults to
     * "wheel".
     */
    roleDescription?: string;
    /**
     * What one wedge is called when it is announced, so a reader hears wedge rather than group. Defaults to
     * "wedge".
     */
    wedgeRoleDescription?: string;
    /** The wedges, in the order they sit round the wheel. */
    wedges: T[];
    /** How long the wheel waits between steps while turning on its own. Leave it out and it stands still until spun. */
    idleDelayMs?: number;
};

export type BaseWheelCommonCbs = {
    /**
     * Names one wedge for assistive technology, and is told how many there are so it can say third of five.
     * The index is zero-based, matching `renderWedge`. It is also what is announced when a spin lands.
     */
    computeWedgeLabel: (index: number, wedgeCount: number) => string;
    /** Chooses which wedge a spin should land on. It may answer later, so the result can come from a server. */
    computeSpinTarget: () => number | Promise<number>;
    /** How a spin to a given wedge should run — how many turns, and on what curve. */
    computeSpinDefs?: (index: number, wedgeCount: number) => RotatorSpinDefs;
    /** Runs when a different wedge reaches the marker, including while the wheel is still turning. */
    onSelectedWedgeChange?: (index: number) => void;
    /** Runs once a spin has finished and settled. */
    onSpinEnd?: (index: number) => void;
};

export type BaseWheelVariantValues = {
    /** Which of the wheel's looks this is. */
    variant: WheelVariant;
};

export type BaseWheelAxisValues = {
    /** Which way round the wheel turns. */
    axis?: WheelAxis;
};

export type BaseWheelSizeValues = {
    /** How large one wedge is. */
    wedgeSize?: Size2d;
};

export type BaseWheelRingValues = {
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
};

export type BaseWheelRingCbs = {
    /** Arranges the wedges, for a wheel that is something other than an even ring. */
    computeLayout?: PlacementLayoutFn;
    /** What the wedges do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
};

export type BaseWheelValues<T> = BaseWheelCommonValues<T> &
    BaseWheelVariantValues &
    BaseWheelAxisValues &
    BaseWheelSizeValues &
    BaseWheelRingValues;

export type BaseWheelCbs = BaseWheelCommonCbs & BaseWheelRingCbs;

export type BaseWheelProps<T> = BaseWheelValues<T> & BaseWheelCbs;

export type BaseOverheadWheelValues<T> = BaseWheelCommonValues<T> & BaseWheelRingValues;

export type BaseOverheadWheelCbs = BaseWheelCommonCbs & BaseWheelRingCbs;

export type BaseOverheadWheelProps<T> = BaseOverheadWheelValues<T> & BaseOverheadWheelCbs;

export type BaseDrumWheelValues<T> = BaseWheelCommonValues<T> & BaseWheelAxisValues & Required<BaseWheelSizeValues>;

export type BaseDrumWheelCbs = BaseWheelCommonCbs;

export type BaseDrumWheelProps<T> = BaseDrumWheelValues<T> & BaseDrumWheelCbs;
