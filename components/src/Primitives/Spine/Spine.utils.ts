import { AngleUtils, CSSUtils, MathUtils } from "@thewaver/ss-utils";
import type { CSSAnimationValues } from "@thewaver/ss-utils";

import { RADIAL_SPINE_DEFAULTS } from "./Spine.const";
import type { RadialSpineDefs, SpineAngleFn, SpineAxis, SpineSide } from "./Spine.types";

/** A half turn, for laying a face over to the other side and for facing a back the other way. */
const HALF_TURN_DEGREES = 180;
/** A quarter turn, where a face stands edge-on to the viewer. */
const QUARTER_TURN_DEGREES = 90;
/** Three quarters of a turn, where a face comes back round to edge-on from the other side. */
const THREE_QUARTER_TURN_DEGREES = 270;
/** How far apart two faces lying flat on each other are pushed, so the browser can tell which is on top. */
const STACK_STEP_PX = 0.25;

/**
 * The geometry of a spine: faces that are all the same box, hinged on one line through its middle, each swung out
 * round that line by its own angle — seen end-on, a star of lines rather than the polygon a barrel makes.
 *
 * At `0` a face lies exactly on the box. A positive angle lifts the face's leading half — the right half on a spine
 * that turns across, the top half on one that turns up and down — towards the viewer and lays it over the other half,
 * which it reaches at `180`, the way a page is turned or a split-flap's flap falls. A face is the whole box, so which
 * part of it is painted is the consumer's: a book's page paints the leading half, a paddle paints it with a gap at the
 * spine. A back is turned a half turn further, so it reads the right way up once its face has gone over, and paints the
 * other half.
 *
 * Each face's angle comes from one rule taking its distance from the current face; {@link SpineUtils.radial} and
 * {@link SpineUtils.leaves} are the two shipped.
 */
export namespace SpineUtils {
    /**
     * How far a face is from the current one, counted straight.
     *
     * @param index Which face this is.
     * @param position Which face is current, fractional while the spine turns.
     * @returns The signed distance, positive for a face still to come.
     */
    export const getDistance = (index: number, position: number) => index - position;

    /**
     * Faces spaced evenly round the spine: a paddle wheel or a rolodex at a whole turn, a fan at less.
     *
     * Each face sits its share of the span further round than the one before, so the faces turn together as the
     * position moves, and at a whole turn the last face sits beside the first.
     *
     * @param defs `spanDegrees`, how far round the faces reach between them.
     * @returns The rule, ready to hand to `Spine`'s `computeFaceAngle`.
     */
    export const createRadial = (defs?: RadialSpineDefs): SpineAngleFn => {
        const spanDegrees = defs?.spanDegrees ?? RADIAL_SPINE_DEFAULTS.spanDegrees;

        return ({ distance, count }) => (count > 0 ? (distance * spanDegrees) / count : 0);
    };

    /** {@link createRadial} with its defaults, a whole turn. */
    export const radial = createRadial();

    /**
     * Faces lying flat on one side and flat on the other, with one turning between: a book's pages or a
     * split-flap's flaps.
     *
     * Every face before the current one has gone over and lies at `180`; the current face and every one after it lie
     * at `0`; the face between the two, less than one face behind, is that far through its turn.
     *
     * @returns The face's angle, from `0` to `180`.
     */
    export const leaves: SpineAngleFn = ({ distance }) => MathUtils.clamp01(-distance) * HALF_TURN_DEGREES;

    /**
     * The turn that swings a face out to an angle, as transform values.
     *
     * @param axis Which way the spine turns: `row` about an upright spine, `column` about a level one.
     * @param angle How far the face is swung out, in degrees.
     * @returns A rotation about the spine, ready to merge into a `ProximityEffect` or to write with
     * `CSSUtils.toAnimationStyle`. It turns about the element's own middle, so the element has to be centered on the
     * spine.
     */
    export const getTurn = (axis: SpineAxis, angle: number): CSSAnimationValues =>
        axis === "row" ? { rotateY: -angle } : { rotateX: -angle };

    /**
     * How far a face's leading half has come towards the viewer.
     *
     * Two faces that share the spine and paint one half each cannot cross, so the one whose painted half is nearer is
     * the one drawn over the other — this is the number to stack them by where the browser is not sorting them itself.
     *
     * @param angle How far the face is swung out, in degrees.
     * @returns From `-1`, pointing straight away, through `0` lying flat, to `1`, pointing straight at the viewer.
     */
    export const getLeadDepth = (angle: number) => Math.sin(AngleUtils.toRadians(angle));

    /**
     * Whether one side of a face is turned away from the viewer, and so out of sight.
     *
     * A front faces the viewer while its face is less than a quarter turn from flat, and a back while it is more than a
     * quarter turn round; edge-on, neither does. This is what a consumer reads to keep the faces nobody can see out of
     * the accessibility tree, though a face that faces the viewer may still be covered by another.
     *
     * @param angle How far the face is swung out, in degrees, however many turns it has gathered.
     * @param side `"front"` or `"back"`.
     */
    export const getIsTurnedAway = (angle: number, side: SpineSide) => {
        const turned = AngleUtils.wrapPositive(angle);
        const isFrontShowing = turned < QUARTER_TURN_DEGREES || turned > THREE_QUARTER_TURN_DEGREES;
        const isBackShowing = turned > QUARTER_TURN_DEGREES && turned < THREE_QUARTER_TURN_DEGREES;

        return side === "front" ? !isFrontShowing : !isBackShowing;
    };

    /**
     * How far a face is pushed back from the viewer, so faces lying flat on each other stack in order.
     *
     * Faces at the same angle lie in one plane, and the browser cannot tell which is on top. Each is pushed back by a
     * fraction of a pixel for every face it is from the current one, so the current face is on top of the ones still to
     * come and the face that went over last is on top of the ones that went before it. The push is far too small to see.
     *
     * @param distance How far the face is from the current one.
     * @param count How many faces there are; a face further away than this is pushed no further.
     * @returns The push in pixels, `0` or less.
     */
    export const getStackOffset = (distance: number, count: number) =>
        -Math.min(Math.abs(distance), Math.max(count, 0)) * STACK_STEP_PX;

    /**
     * The transform that swings one face out round the spine.
     *
     * @param axis Which way the spine turns.
     * @param side `"front"` or `"back"`. A back is turned a further half turn, so it shows once its face has gone over.
     * @param angle How far the face is swung out, from the face's rule.
     * @param stackOffsetPx How far the face is pushed back, from {@link getStackOffset}.
     */
    export const getFaceTransform = (axis: SpineAxis, side: SpineSide, angle: number, stackOffsetPx: number) => {
        const { transform } = CSSUtils.toAnimationStyle({ translateZ: stackOffsetPx, ...getTurn(axis, angle) });

        if (side === "front") return transform;

        return `${transform} ${axis === "row" ? "rotateY" : "rotateX"}(${HALF_TURN_DEGREES}deg)`;
    };
}
