export type SpineAxis = "row" | "column";

export type SpineSide = "front" | "back";

export type SpineFaceDefs = {
    /** Names this face for assistive technology. */
    ariaLabel: string;
    /** Whether this face is kept out of the accessibility tree, which the faces turned away from the viewer are. */
    isHidden: boolean;
};

export type SpineAngleDefs = {
    /**
     * How far this face is from the current one, in faces: `0` for the current face, `1` for the next, `-1` for the
     * one before, and fractions while the spine turns. Counted straight, never the short way round.
     */
    distance: number;
    /** Which face this is, counting from zero. */
    index: number;
    /** How many faces there are. */
    count: number;
};

export type SpineAngleFn = (defs: SpineAngleDefs) => number;

export type RadialSpineDefs = {
    /** How far round the spine the faces reach between them, in degrees: `360` closes them into a wheel. */
    spanDegrees?: number;
};
