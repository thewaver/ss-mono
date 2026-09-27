import { AngleUtils, type CSSAnimationStyle, CSSUtils, type Point2d } from "@thewaver/ss-utils";

import type { PlacementLayout, PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import type { ProximityArrangement, ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import { ProximityUtils } from "../../Abstracts/Proximity/Proximity.utils";
import type { RotatorPhase } from "../../Abstracts/Rotator/Rotator.types";

/** The path a wheel's layout is asked for: the wheel is one ring, with no parent above it. */
const ROOT_PATH: number[] = [];

/** The parent extent a wheel's layout is asked for, since nothing surrounds the ring. */
const NO_PARENT_EXTENT = 0;

/** The wedge whose resting placement every other wedge is turned from. */
const FIRST_WEDGE = 0;

/** The correction for a layout that has no sector to measure, which leaves the wedges where they are. */
const NO_CORRECTION = 0;

/** Halfway, for the middle of a sector. */
const HALF = 0.5;

/** An overhead wheel is square, so its height is its width. */
const SQUARE_HEIGHT_RATIO = 1;

/** The overreach while the pointer is nowhere near the wheel. */
const NO_OVERREACH = 0;

/** Turns a point about an origin. */
const toTurnedPoint = (point: Point2d, origin: Point2d, degrees: number): Point2d => {
    const radians = degrees * AngleUtils.RADIANS_PER_DEGREE;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const offset = { x: point.x - origin.x, y: point.y - origin.y };

    return {
        x: origin.x + offset.x * cos - offset.y * sin,
        y: origin.y + offset.x * sin + offset.y * cos,
    };
};

/** Where a wheel's wedges sit and what they do near the pointer: the arithmetic both frameworks draw from. */
export namespace WheelUtils {
    /**
     * Lays out a wheel's wedges with the consumer's layout function.
     *
     * The wheel is always one ring with nothing around it, so the layout is asked for the root path and no parent
     * extent; this saves each view from spelling that out.
     *
     * @param computeLayout The consumer's layout function, if any.
     * @param wedgeCount How many wedges there are.
     * @returns The layout, or `undefined` for a wheel with no layout function.
     */
    export const computeLayout = (computeLayout: PlacementLayoutFn | undefined, wedgeCount: number) =>
        computeLayout?.({ itemCount: wedgeCount, path: ROOT_PATH, parentExtent: NO_PARENT_EXTENT });

    /**
     * How far every wedge has to be turned so that the first one's middle sits on the marker.
     *
     * A layout puts its first sector wherever its own arithmetic starts; the marker is where the consumer said a
     * spin lands. The difference between the two is added to every wedge's angle, so a spin that lands on a wedge
     * lands on its middle rather than its edge.
     *
     * @param layout The wheel's layout, if it has one.
     * @param markerDegrees Where the marker sits, in degrees.
     * @returns The correction in degrees, or `0` for a layout without sectors.
     */
    export const getMarkerCorrection = (layout: PlacementLayout | undefined, markerDegrees: number) => {
        const sector = layout?.placements[FIRST_WEDGE]?.sector;

        if (!sector) return NO_CORRECTION;

        return markerDegrees - (sector.fromAngle + sector.toAngle) * HALF;
    };

    /**
     * How far round one wedge is drawn, in degrees.
     *
     * @param markerCorrection The correction from {@link getMarkerCorrection}.
     * @param index Which wedge, counting from zero.
     * @param stepAngle The angle between neighboring wedges.
     * @param angle How far the wheel as a whole has turned.
     * @returns The wedge's angle.
     */
    export const getWedgeAngle = (markerCorrection: number, index: number, stepAngle: number, angle: number) =>
        markerCorrection + index * stepAngle + angle;

    /**
     * Which wedge is picked out as selected.
     *
     * A wheel turning by itself has picked nothing — the wedge passing the marker is only where the turn happens
     * to be — so there is no selection while it idles. Otherwise the wedge at the marker is the selection, and it
     * moves with the wheel through a spin rather than appearing at the end.
     *
     * @param phase What the wheel is doing.
     * @param currentIndex The wedge at the marker right now.
     * @returns The selected wedge, or `undefined` while idling.
     */
    export const getSelectedIndex = (phase: RotatorPhase, currentIndex: number) =>
        phase === "idling" ? undefined : currentIndex;

    /**
     * Whether the turn under way was started by a spin rather than by the idle drift.
     *
     * @param isAwaitingTarget Whether a spin is waiting for its target to be chosen.
     * @param phase What the wheel is doing.
     * @returns `true` from the moment a spin is asked for until it has settled.
     */
    export const getIsUserSpinning = (isAwaitingTarget: boolean, phase: RotatorPhase) =>
        isAwaitingTarget || phase === "spinning" || phase === "settling";

    /**
     * Where the pointer is on an overhead wheel, in the layout's own coordinates.
     *
     * @param layout The wheel's layout, if it has one.
     * @param boxRatio The pointer's position as a `0` to `1` ratio across the wheel's box.
     * @param isPointerPresent Whether the pointer is in the window at all.
     * @returns The point, or `undefined` when there is no layout, no pointer, or the pointer is out of the
     * layout's reach.
     */
    export const getPointerPoint = (
        layout: PlacementLayout | undefined,
        boxRatio: Point2d,
        isPointerPresent: boolean,
    ) => {
        if (!isPointerPresent || !layout) return undefined;

        const point = PlacementUtils.toLayoutPoint(boxRatio, SQUARE_HEIGHT_RATIO);

        return PlacementUtils.getIsWithinReach(layout, point) ? point : undefined;
    };

    /**
     * How far past the run of wedges the pointer has gone, for an effect that fades out beyond the ends.
     *
     * @param layout The wheel's layout, if it has one.
     * @param point The pointer, from {@link getPointerPoint}.
     * @returns The overreach, or `0` without a layout or a pointer.
     */
    export const getOverreach = (layout: PlacementLayout | undefined, point: Point2d | undefined) =>
        layout === undefined || point === undefined ? NO_OVERREACH : PlacementUtils.getRunOverreach(layout, point);

    /**
     * What one wedge of an overhead wheel looks like as the pointer nears it.
     *
     * The layout places every wedge at rest in the first wedge's spot; this turns that spot round to where the
     * wedge actually is right now, frames it against the wheel as a whole, and hands the result to the consumer's
     * effect — the resting version of it while the pointer is away.
     *
     * @param defs.computeEffect The consumer's effect, if any.
     * @param defs.layout The wheel's layout, if it has one.
     * @param defs.arrangement The layout as the proximity effects read it.
     * @param defs.angle The wedge's angle, from {@link getWedgeAngle}.
     * @param defs.point The pointer, from {@link getPointerPoint}.
     * @param defs.overreach The overreach, from {@link getOverreach}.
     * @param defs.prefersReducedMotion Whether the visitor has asked for less motion.
     * @returns The `transform` and `filter` to add to the wedge, or `undefined` when there is no effect to apply.
     */
    export const computeWedgeEffect = (defs: {
        computeEffect: ProximityEffectFn | undefined;
        layout: PlacementLayout | undefined;
        arrangement: ProximityArrangement | undefined;
        angle: number;
        point: Point2d | undefined;
        overreach: number;
        prefersReducedMotion: boolean;
    }): CSSAnimationStyle | undefined => {
        const { computeEffect, layout, arrangement, angle, point } = defs;
        const resting = layout?.placements[FIRST_WEDGE];

        if (!computeEffect || !layout || !arrangement || !resting) return undefined;

        const origin = PlacementUtils.getOrigin(layout);
        const center = toTurnedPoint(PlacementUtils.getCenter(resting), origin, angle);
        const placement: PlacementRect = { ...resting, leftShare: center.x, topShare: center.y, angle };
        const frame: PlacementRect = {
            leftShare: origin.x,
            topShare: origin.y,
            widthShare: SQUARE_HEIGHT_RATIO,
            heightShare: SQUARE_HEIGHT_RATIO,
            angle,
        };

        const effectDefs =
            point === undefined
                ? ProximityUtils.toRestingEffectDefs(placement, arrangement, defs.prefersReducedMotion, frame)
                : ProximityUtils.toEffectDefs(
                      placement,
                      point,
                      arrangement,
                      defs.prefersReducedMotion,
                      frame,
                      defs.overreach,
                  );

        return CSSUtils.toAnimationStyle(computeEffect(effectDefs));
    };

    /**
     * The transform one wedge of an overhead wheel is drawn with.
     *
     * @param angle The wedge's angle, from {@link getWedgeAngle}.
     * @param effect The wedge's effect, from {@link computeWedgeEffect}.
     * @returns The wedge's turn, followed by the effect's own transform when it has one.
     */
    export const getWedgeTransform = (angle: number, effect: CSSAnimationStyle | undefined) =>
        `rotate(${angle}deg)${effect?.transform ? ` ${effect.transform}` : ""}`;
}
