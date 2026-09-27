import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
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
     * The index is zero-based, matching `renderWedge`. It is also what is announced when a spin lands.
     */
    computeWedgeLabel: (index: number, wedgeCount: number) => string;
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
};
