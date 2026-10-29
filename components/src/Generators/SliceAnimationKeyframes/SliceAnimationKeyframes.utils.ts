import { type CSSAnimationKey, type Index2d, Matrix3dUtils, type Point3d } from "@thewaver/ss-utils";

import type {
    SliceAnimationEvaluationDefs,
    SliceAnimationEvaluationResult,
} from "../../Exotics/Animations/CellAnimation/CellAnimation.types";
import { CellAnimationZoneUtils } from "../CellAnimationZones/CellAnimationZones.utils";
import type {
    SliceAnimationBreakpointTriple,
    SliceAnimationEasing,
} from "../SliceAnimationBreakpoints/SliceAnimationBreakpoints.types";
import { SliceAnimationBreakpointUtils } from "../SliceAnimationBreakpoints/SliceAnimationBreakpoints.utils";
import type {
    CompiledSliceStops,
    SliceAnimationDefinition,
    SliceAnimationFn,
    SliceStop,
    SliceStopTrack,
    SliceStopsFn,
    SliceZone,
} from "./SliceAnimationKeyframes.types";

const RESULT_DECIMAL_PLACES = 3;
const RESULT_SCALE = 10 ** RESULT_DECIMAL_PLACES;

const roundForStyle = (value: number) => Math.round(value * RESULT_SCALE) / RESULT_SCALE;

const definitions = new WeakMap<SliceAnimationFn, SliceAnimationDefinition>();

const define = (definition: SliceAnimationDefinition, animation: SliceAnimationFn) => {
    definitions.set(animation, definition);

    return animation;
};

/**
 * Builds the per-cell functions a cell animation plays, from keyframes rather than from code.
 *
 * A cell animation asks for one function from a cell's own progress to a set of CSS transform and filter
 * values. Writing that by hand means interpolating every property yourself; these take a list of stops — at
 * this point, these values — and do the interpolation, the transform origin and the depth for you. The result
 * is an ordinary function, so a keyframed animation and a hand-written one are interchangeable.
 */
export namespace SliceAnimationKeyframeUtils {
    /**
     * Regroups a list of stops by property, so each property can be interpolated on its own.
     *
     * A stop need not name every property; a property is only tracked between the stops that mention it, so
     * one that appears in two stops of five moves between those two and holds still elsewhere.
     *
     * @param stops The keyframes, in timeline order.
     * @returns One track per property, each a list of positions and values.
     */
    export const compileStops = (stops: SliceStop[]): CompiledSliceStops => {
        const compiled: CompiledSliceStops = {};

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
    export const sampleTrack = (track: SliceStopTrack, timeline: number) => {
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
    export const fromStops = (stops: SliceStop[]): SliceAnimationFn => {
        const tracks = Object.entries(compileStops(stops));

        return define({ kind: "stops", stops }, (timeline, defs) => {
            const result: Partial<Record<CSSAnimationKey, number>> = {};

            let originX: number | undefined;
            let originY: number | undefined;
            let depth: number | undefined;

            for (const [key, track] of tracks) {
                const value = sampleTrack(track, timeline);

                if (key === "originX") {
                    originX = value;
                } else if (key === "originY") {
                    originY = value;
                } else if (key === "depth") {
                    depth = value;
                } else {
                    result[key as CSSAnimationKey] = roundForStyle(value);
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

            result.translateX = roundForStyle(
                (result.translateX ?? 0) + (width > 0 ? (translation.x / width) * 100 : 0),
            );
            result.translateY = roundForStyle(
                (result.translateY ?? 0) + (height > 0 ? (translation.y / height) * 100 : 0),
            );

            if (translation.z !== 0 || result.translateZ !== undefined) {
                result.translateZ = roundForStyle((result.translateZ ?? 0) + translation.z);
            }

            return result;
        });
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
    export const fromZones = (zones: SliceZone[], fallback: SliceAnimationFn): SliceAnimationFn =>
        define({ kind: "zones", zones, fallback }, (timeline, defs) => {
            for (const { zone, animation } of zones) {
                if (CellAnimationZoneUtils.isInZone(zone, defs)) return animation(timeline, defs);
            }

            return fallback(timeline, defs);
        });

    /**
     * Plays stops of each cell's own, worked out from the cell.
     *
     * For variation zones cannot name: a shift drawn at random for each line, a phase that moves along the grid, a
     * cell picked by a hash. The function is asked for the stops rather than the values, so a renderer that works
     * the keyframes out elsewhere can ask it once per grid and never per frame. It should return the same array for
     * the same cell for as long as the animation is in use; to change the stops, build a new animation.
     *
     * @param computeStops The stops one cell plays, from the cell and the grid.
     * @returns One animation that plays each cell its own stops.
     */
    export const fromSlices = (computeStops: SliceStopsFn): SliceAnimationFn => {
        const compiled = new WeakMap<SliceStop[], SliceAnimationFn>();

        return define({ kind: "slices", computeStops }, (timeline, defs) => {
            const stops = computeStops(defs);
            const animation = compiled.get(stops) ?? fromStops(stops);

            compiled.set(stops, animation);

            return animation(timeline, defs);
        });
    };

    /**
     * What an animation was built from, when it was built by {@link fromStops}, {@link fromZones} or
     * {@link fromSlices}.
     *
     * Lets a renderer that cannot call a function for every cell on every frame — one working the keyframes out on
     * the graphics card — read the stops instead. A hand-written function has no definition.
     *
     * @param animation The animation to look up.
     * @returns Its stops, its zones or its per-cell stops, or `undefined` for an animation written by hand.
     */
    export const getDefinition = (animation: SliceAnimationFn) => definitions.get(animation);

    /**
     * The stops one cell of an animation plays, following zones and per-cell stops down to a table.
     *
     * @param animation The animation, as handed to the component.
     * @param defs The cell and the grid, as the animation would be handed them.
     * @returns The cell's stops, or `undefined` when any step on the way was written by hand.
     */
    export const resolveStops = (
        animation: SliceAnimationFn,
        defs: SliceAnimationEvaluationDefs & { origin: Index2d },
    ): SliceStop[] | undefined => {
        const definition = definitions.get(animation);

        if (!definition) return undefined;
        if (definition.kind === "stops") return definition.stops;
        if (definition.kind === "slices") return definition.computeStops(defs);

        const match = definition.zones.find(({ zone }) => CellAnimationZoneUtils.isInZone(zone, defs));

        return resolveStops(match ? match.animation : definition.fallback, defs);
    };

    /**
     * Evaluates an animation for one cell at one point on the shared timeline.
     *
     * This is the step that makes a stagger: the shared timeline is mapped onto the cell's own window, and eased,
     * before the animation sees it — so the animation itself only ever deals in a cell's progress from `0` to
     * `1`, and knows nothing about when its turn comes.
     *
     * @param animation The animation to play.
     * @param breakpoints The cell's window, from `SliceAnimationBreakpointUtils.computeBreakpoints`.
     * @param defs The cell and the grid, as the component hands them over.
     * @param timeline Where the shared timeline is, from `0` to `1`.
     * @param easing The curve applied to the cell's progress; linear if left out.
     * @returns The CSS values for this cell at this moment.
     */
    export const computeAnimation = (
        animation: SliceAnimationFn,
        breakpoints: SliceAnimationBreakpointTriple,
        defs: SliceAnimationEvaluationDefs & { origin: Index2d },
        timeline: number,
        easing?: SliceAnimationEasing,
    ): SliceAnimationEvaluationResult =>
        animation(SliceAnimationBreakpointUtils.computeLocalTimeline(breakpoints, timeline, easing), defs);
}
