import type { Size2d } from "@thewaver/ss-utils";

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

export type BaseSpineValues<T> = {
    /**
     * Which face is current, counting from zero, and fractional while the spine turns. It is the only thing that turns
     * the spine: each face's distance from it is what the face's angle is worked out from. Counted straight, so a
     * wheel turned past its last face keeps counting rather than coming back to `0`.
     */
    position: number;
    /** Which way the spine turns: `row` about an upright spine through the middle, `column` about a level one. */
    axis?: SpineAxis;
    /**
     * How large the box is, which every face fills. Left out, the box fills the element around it, which then has to
     * have a size of its own. A spine hinged on an edge is this box moved by half its size.
     */
    faceSize?: Size2d;
    /** How far away the viewer sits, in pixels. Nearer exaggerates how a face swung towards the viewer grows. */
    perspectivePx?: number;
    /**
     * Whether the faces have backs, for a spine whose faces are seen from behind once they go over. A back is drawn
     * the right way up once its face has turned the half turn to the other side, so it paints the other half of the
     * box. Defaults to `false`.
     */
    hasBacks?: boolean;
    /** How long a face takes to swing to a new angle when the position jumps. Left out, it swings at once. */
    transitionDurationMs?: number;
    /** How long the spine waits before swinging. */
    transitionDelayMs?: number;
    /** What a face is called when it is announced, so a reader hears page or card rather than group. */
    faceRoleDescription: string;
    /** The faces, in order: a face's distance from the current one is its place in this list less the position. */
    faces: T[];
};

export type BaseSpineCbs = {
    /**
     * The rule that sets each face's angle from its distance to the current one, in degrees: `0` lies on the box and
     * `180` lies over on the other half. `SpineUtils.radial` spaces the faces evenly round a turn, as a paddle wheel or a
     * rolodex; `SpineUtils.leaves` lays the passed ones on one side and the rest on the other, as a book or a
     * split-flap. A rule must be continuous in the distance, or a moving position makes a face jump.
     */
    computeFaceAngle: SpineAngleFn;
    /**
     * Names one face and says whether a reader can reach it, told the face's angle so the faces turned away can be
     * hidden — `SpineUtils.getIsTurnedAway` answers that part. Hiding a face that faces the viewer but is covered by
     * another is the consumer's to decide.
     */
    computeFaceDefs: (index: number, side: SpineSide, angle: number) => SpineFaceDefs;
};

export type BaseSpineProps<T> = BaseSpineValues<T> & BaseSpineCbs;
