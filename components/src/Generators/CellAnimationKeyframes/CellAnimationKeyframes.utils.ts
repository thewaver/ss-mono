import { type CSSAnimationKey, type Index2d, MathUtils, Matrix3dUtils, type Point3d } from "@thewaver/ss-utils";

import type {
    CellAnimationEvaluationDefs,
    CellAnimationEvaluationResult,
} from "../../Exotics/CellAnimation/CellAnimation.types";
import type {
    CellAnimationBreakpointTriple,
    CellAnimationEasing,
} from "../CellAnimationBreakpoints/CellAnimationBreakpoints.types";
import { CellAnimationBreakpointUtils } from "../CellAnimationBreakpoints/CellAnimationBreakpoints.utils";
import { CellAnimationZoneUtils } from "../CellAnimationZones/CellAnimationZones.utils";
import type {
    CellAnimationFn,
    CellStop,
    CellStopTrack,
    CellZone,
    CompiledCellStops,
} from "./CellAnimationKeyframes.types";

const RESULT_DECIMAL_PLACES = 3;

/**
 * Builds the per-cell functions a cell animation plays, from keyframes rather than from code.
 *
 * A cell animation asks for one function from a cell's own progress to a set of CSS transform and filter
 * values. Writing that by hand means interpolating every property yourself; these take a list of stops — at
 * this point, these values — and do the interpolation, the transform origin and the depth for you. The result
 * is an ordinary function, so a keyframed animation and a hand-written one are interchangeable.
 */
export namespace CellAnimationKeyframeUtils {
    /**
     * Regroups a list of stops by property, so each property can be interpolated on its own.
     *
     * A stop need not name every property; a property is only tracked between the stops that mention it, so
     * one that appears in two stops of five moves between those two and holds still elsewhere.
     *
     * @param stops The keyframes, in timeline order.
     * @returns One track per property, each a list of positions and values.
     */
    export const compileStops = (stops: CellStop[]): CompiledCellStops => {
        const compiled: CompiledCellStops = {};

        for (const stop of stops) {
            for (const [key, value] of Object.entries(stop)) {
                if (key === "at" || value === undefined) continue;

                compiled[key] ??= [];
                compiled[key].push({ at: stop.at, value });
            }
        }

        return compiled;
    };

    /**
     * The value of one property's track at a point on the timeline, interpolated linearly between its stops.
     *
     * Before the first stop the first value holds, and after the last the last value holds, so a property never
     * moves outside the stretch its stops cover. Two stops at the same position make a jump rather than a
     * division by nothing.
     *
     * @param track One property's track, from {@link compileStops}.
     * @param timeline The cell's own progress, from `0` to `1`.
     * @returns The property's value there.
     */
    export const sampleTrack = (track: CellStopTrack, timeline: number) => {
        if (timeline <= track[0].at) return track[0].value;

        for (let i = 1; i < track.length; i++) {
            if (timeline <= track[i].at) {
                const span = track[i].at - track[i - 1].at;
                const ratio = span <= 0 ? 1 : (timeline - track[i - 1].at) / span;

                return track[i - 1].value + (track[i].value - track[i - 1].value) * ratio;
            }
        }

        return track[track.length - 1].value;
    };

    /**
     * Turns a list of keyframes into the function a cell animation plays for every cell.
     *
     * Besides the CSS properties, a stop may carry `originX` and `originY`, the point the cell turns and scales
     * about as a share of the cell, and `depth`, how far towards the viewer it is pushed as a share of its larger
     * side. None of those three is a CSS property, so they are folded into the translation: the cell comes out
     * turned about the point the stops named, with nothing but ordinary transform values in the result.
     *
     * @param stops The keyframes, in timeline order.
     * @returns The animation, ready to hand to the component.
     */
    export const fromStops = (stops: CellStop[]): CellAnimationFn => {
        const compiled = compileStops(stops);

        return (timeline, defs) => {
            const result: Partial<Record<CSSAnimationKey, number>> = {};

            let originX: number | undefined;
            let originY: number | undefined;
            let depth: number | undefined;

            for (const [key, track] of Object.entries(compiled)) {
                const value = sampleTrack(track, timeline);

                if (key === "originX") {
                    originX = value;
                } else if (key === "originY") {
                    originY = value;
                } else if (key === "depth") {
                    depth = value;
                } else {
                    result[key as CSSAnimationKey] = MathUtils.roundToDecimalPlaces(value, RESULT_DECIMAL_PLACES);
                }
            }

            if (originX === undefined && originY === undefined && depth === undefined) return result;

            const { width, height } = defs.size;
            const anchor: Point3d = {
                x: ((originX ?? 0.5) - 0.5) * width,
                y: ((originY ?? 0.5) - 0.5) * height,
                z: 0,
            };
            const offset: Point3d = { x: 0, y: 0, z: ((depth ?? 0) * Math.max(width, height)) / 100 };
            const matrix = Matrix3dUtils.multiply(
                Matrix3dUtils.multiply(
                    Matrix3dUtils.multiply(
                        Matrix3dUtils.rotationZ(result.rotate ?? 0),
                        Matrix3dUtils.rotationX(result.rotateX ?? 0),
                    ),
                    Matrix3dUtils.rotationY(result.rotateY ?? 0),
                ),
                Matrix3dUtils.scaling((result.scaleX ?? 100) / 100, (result.scaleY ?? 100) / 100),
            );
            const rotatedAnchor = Matrix3dUtils.apply(matrix, anchor);
            const rotatedOffset = Matrix3dUtils.apply(matrix, offset);
            const translation: Point3d = {
                x: anchor.x - rotatedAnchor.x + rotatedOffset.x,
                y: anchor.y - rotatedAnchor.y + rotatedOffset.y,
                z: anchor.z - rotatedAnchor.z + rotatedOffset.z,
            };

            result.translateX = MathUtils.roundToDecimalPlaces(
                (result.translateX ?? 0) + (width > 0 ? (translation.x / width) * 100 : 0),
                RESULT_DECIMAL_PLACES,
            );
            result.translateY = MathUtils.roundToDecimalPlaces(
                (result.translateY ?? 0) + (height > 0 ? (translation.y / height) * 100 : 0),
                RESULT_DECIMAL_PLACES,
            );

            if (translation.z !== 0 || result.translateZ !== undefined) {
                result.translateZ = MathUtils.roundToDecimalPlaces(
                    (result.translateZ ?? 0) + translation.z,
                    RESULT_DECIMAL_PLACES,
                );
            }

            return result;
        };
    };

    /**
     * Plays a different animation in different parts of the grid.
     *
     * Each zone is tried in the order given and the first one the cell falls in decides, so a narrow zone listed
     * before a wide one takes precedence over it. A cell in none of them plays the fallback.
     *
     * @param zones The zones and the animation for each, as named by `CellAnimationZoneUtils`.
     * @param fallback What a cell outside every zone plays.
     * @returns One animation that dispatches by zone.
     */
    export const fromZones =
        (zones: CellZone[], fallback: CellAnimationFn): CellAnimationFn =>
        (timeline, defs) => {
            for (const { zone, animation } of zones) {
                if (CellAnimationZoneUtils.isInZone(zone, defs)) return animation(timeline, defs);
            }

            return fallback(timeline, defs);
        };

    /**
     * Evaluates an animation for one cell at one point on the shared timeline.
     *
     * This is the step that makes a stagger: the shared timeline is mapped onto the cell's own window, and eased,
     * before the animation sees it — so the animation itself only ever deals in a cell's progress from `0` to
     * `1`, and knows nothing about when its turn comes.
     *
     * @param animation The animation to play.
     * @param breakpoints The cell's window, from `CellAnimationBreakpointUtils.computeBreakpoints`.
     * @param defs The cell and the grid, as the component hands them over.
     * @param timeline Where the shared timeline is, from `0` to `1`.
     * @param easing The curve applied to the cell's progress; linear if left out.
     * @returns The CSS values for this cell at this moment.
     */
    export const computeAnimation = (
        animation: CellAnimationFn,
        breakpoints: CellAnimationBreakpointTriple,
        defs: CellAnimationEvaluationDefs & { origin: Index2d },
        timeline: number,
        easing?: CellAnimationEasing,
    ): CellAnimationEvaluationResult =>
        animation(CellAnimationBreakpointUtils.computeLocalTimeline(breakpoints, timeline, easing), defs);
}
