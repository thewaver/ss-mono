import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import type { ProximityEffectDefs, ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import { ProximityUtils } from "../../Abstracts/Proximity/Proximity.utils";
import { ProximityEffectDefaults } from "./ProximityEffects.const";
import type { FadeDefs, GlowDefs, ProximityEffectEntry, ZoomInDefs } from "./ProximityEffects.types";

const NOTHING = 0;
const WHOLE = 1;
const PERCENT = 100;
const NO_DIRECTION = 1e-6;
const SHARED_ENDS = 0.5;
const FIRST_STEP = 1;
const CUBE = 3;

/**
 * Whether an arrangement is a run — items evenly spaced along one line or one curve — rather than a scatter.
 *
 * A run can count the items between one of its own and the pointer, because they sit at known steps along
 * it; a scatter cannot, and an attempt to round its distances into steps jumps by a whole item each time the
 * rounding tips over.
 */
const getIsRun = (effectDefs: ProximityEffectDefs) =>
    effectDefs.reachRule === "horizontal" || effectDefs.reachRule === "vertical" || effectDefs.reachRule === "arc";

/**
 * How much falloff lies along a straight line, from its nearest point to the pointer out to a given distance.
 *
 * The area under {@link ProximityUtils.getFalloff}'s curve, in closed form. The curve is `1` minus the square
 * of the distance over the reach and nothing past the reach, so a line passing the pointer at a distance
 * meets a lower curve that ends sooner, and one passing a whole reach away meets none of it.
 *
 * @param distance How far along the line to measure, from its point nearest the pointer.
 * @param reach How far the effect carries.
 * @param across How far the line passes from the pointer. `0` for a line through it.
 * @returns The area, in layout units.
 */
const toFalloffArea = (distance: number, reach: number, across = NOTHING) => {
    if (reach < NO_DIRECTION) return NOTHING;

    const height = WHOLE - (across * across) / (reach * reach);

    if (height <= NOTHING) return NOTHING;

    const span = Math.min(distance, reach * Math.sqrt(height));

    return height * span - span ** CUBE / (CUBE * reach * reach);
};

/**
 * Where the pointer sits against an item's run: how far along it, how far off to its side, and how long
 * the item itself is in the run's direction.
 *
 * A row and a column are straight, so the pointer's offset splits cleanly into the two, and the part off
 * to the side is the same for every item in them. Any other arrangement is read as though the pointer
 * lay on the run, at the distance the arrangement itself measures — arc length round a ring, a straight
 * line across a scatter.
 */
const toRunMeasure = (effectDefs: ProximityEffectDefs) => {
    const { offset, placement } = effectDefs;

    switch (effectDefs.reachRule) {
        case "horizontal":
            return { along: Math.abs(offset.x), across: Math.abs(offset.y), extent: placement.widthShare };
        case "vertical":
            return { along: Math.abs(offset.y), across: Math.abs(offset.x), extent: placement.heightShare };
    }

    return { along: effectDefs.distance, across: NOTHING, extent: placement.widthShare };
};

/**
 * How far an item has to travel away from the pointer so that everything grown between them fits.
 *
 * Two neighbors keep the gap between them only if they part by exactly the growth of their facing halves,
 * so an item's travel is the sum of that over every pair between it and the pointer. It is counted item by
 * item at the run's own spacing rather than read off a smooth curve, which is what leaves no overlap at all
 * in an evenly spaced run: a curve is right on average and wrong at every individual pair.
 *
 * The two items either side of the pointer share their own pair's growth in proportion to how far each is
 * from it, so the item the pointer is on stays put and the share hands over without a jump as the pointer
 * crosses it. Once the pointer is off the run's end, nothing lies between it and the end item, which grows
 * where it stands.
 *
 * @param effectDefs The item's measurements.
 * @param reach How far the effect carries, in layout units.
 * @param growthRatio How much the item under the pointer grows.
 * @returns The travel in layout units, never negative.
 */
const toCountedRoom = (effectDefs: ProximityEffectDefs, reach: number, growthRatio: number) => {
    const spacing = effectDefs.spacing;

    if (spacing < NO_DIRECTION) return NOTHING;

    const { along, across, extent } = toRunMeasure(effectDefs);
    const overshoot = Math.sqrt(Math.max(effectDefs.overreach ** 2 - across ** 2, NOTHING));
    const isWithinRun = overshoot < NO_DIRECTION;
    const nearest = isWithinRun
        ? Math.max(along - spacing * Math.floor(along / spacing + NO_DIRECTION), NOTHING)
        : overshoot;
    const steps = Math.round((along - nearest) / spacing);
    const getHalfGrowthAt = (gap: number) =>
        extent *
        SHARED_ENDS *
        growthRatio *
        ProximityUtils.getFalloff({ ...effectDefs, distance: Math.hypot(gap, across) }, reach);

    let room = isWithinRun
        ? (getHalfGrowthAt(nearest) + getHalfGrowthAt(spacing - nearest)) * (nearest / spacing)
        : NOTHING;

    for (let step = FIRST_STEP; step <= steps; step++) {
        const inner = nearest + (step - FIRST_STEP) * spacing;

        if (inner >= reach) break;

        room += getHalfGrowthAt(inner) + getHalfGrowthAt(inner + spacing);
    }

    return room;
};

/**
 * How far and which way a scattered item travels when the space round the pointer grows outward evenly.
 *
 * A scatter has no steps to count, so rather than adding up its items' growth this grows the space they sit
 * in, the way a magnifying glass does — D3's circular fisheye without its fixed rim. Every distance out from
 * the lens's middle is stretched by what an item at that distance grows by, so the travel is the area under
 * the falloff out to the item's own distance ({@link toFalloffArea}). Two items at the same distance part by
 * at least as much as they grew, whichever way round the middle they lie, and gaps grow along with the items.
 *
 * The rim is dropped because it is what keeps a lens's edge still, by squeezing everything just inside it; an
 * item there does not shrink to match, so it would overlap its neighbors.
 *
 * **The lens sits on the pointer while the pointer is among the items, and on the nearest point of them once
 * it is not.** Grown from the pointer itself, a lens off to one side of a scatter would stretch the empty
 * space between them and shift the whole scatter away for nothing. Moved to the nearest point of the box the
 * items' centers cover and weakened by how far off the pointer is, it grows nothing the pointer is not near,
 * and still stretches every item at least as much as it grows: no item in that box is nearer the pointer than
 * the lens's middle and the pointer's distance from it allow. It reaches nothing once the pointer is a whole
 * reach away, and moves without a jump as the pointer crosses the box's edge.
 *
 * @param effectDefs The item's measurements.
 * @param reach How far the effect carries, in layout units.
 * @param share How much the space grows under the pointer.
 * @returns The displacement in layout units.
 */
const toCircularDisplacement = (effectDefs: ProximityEffectDefs, reach: number, share: number): Point2d => {
    const { offset, span } = effectDefs;
    const center = PlacementUtils.getCenter(effectDefs.placement);
    const pointer = { x: center.x + offset.x, y: center.y + offset.y };
    const middle =
        span === undefined
            ? pointer
            : {
                  x: MathUtils.clamp(pointer.x, span.min.x, span.max.x),
                  y: MathUtils.clamp(pointer.y, span.min.y, span.max.y),
              };
    const away = { x: center.x - middle.x, y: center.y - middle.y };
    const length = Math.hypot(away.x, away.y);

    if (length < NO_DIRECTION) return { x: NOTHING, y: NOTHING };

    const travel = share * toFalloffArea(length, reach, effectDefs.overreach);

    return { x: (away.x / length) * travel, y: (away.y / length) * travel };
};

/**
 * How far a scattered item travels away from the pointer across and down: each axis is stretched on its own.
 *
 * D3's cartesian fisheye without its fixed edges. The across position of everything is stretched by how much
 * an item level with the pointer's column would grow, and the down position by how much one level with its
 * row would, so a line of items stays a line — which is what suits a grid. Each axis is stretched at least as
 * much as any item at that position grows, so nothing overlaps; the price is that it stretches more than
 * needed, an item level with the pointer moving aside however far above or below it sits.
 *
 * Each axis starts stretching only at the edge of the box the items' centers cover, and counts only items as
 * near on the other axis as that box allows, so a pointer outside the items moves nothing it has not grown —
 * exactly, there being no circle to approximate.
 *
 * @param effectDefs The item's measurements.
 * @param reach How far the effect carries, in layout units.
 * @param share How much the space grows under the pointer.
 * @returns The displacement in layout units, away from the pointer on each axis.
 */
const toCartesianDisplacement = (effectDefs: ProximityEffectDefs, reach: number, share: number): Point2d => {
    const { offset, span } = effectDefs;
    const center = PlacementUtils.getCenter(effectDefs.placement);
    const outside =
        span === undefined
            ? { x: NOTHING, y: NOTHING }
            : PlacementUtils.getSpanOvershoot(span, { x: center.x + offset.x, y: center.y + offset.y });
    const toAxisRoom = (gap: number, outsideAlong: number, outsideAcross: number) =>
        share *
        Math.max(toFalloffArea(gap, reach, outsideAcross) - toFalloffArea(outsideAlong, reach, outsideAcross), NOTHING);

    return {
        x: -Math.sign(offset.x) * toAxisRoom(Math.abs(offset.x), outside.x, outside.y),
        y: -Math.sign(offset.y) * toAxisRoom(Math.abs(offset.y), outside.y, outside.x),
    };
};

/**
 * Where an item moves to make room, by whichever mechanism its arrangement calls for.
 *
 * A run counts its items ({@link toCountedRoom}) and moves along itself, clamped to the room it has to spread
 * into. A scatter grows its space instead, evenly outward ({@link toCircularDisplacement}) or one axis at a
 * time ({@link toCartesianDisplacement}), as its layout's `spreadRule` says; a layout that says nothing
 * spreads in a circle.
 */
const toGivingWay = (
    effectDefs: ProximityEffectDefs,
    reach: number,
    growthRatio: number,
    pushRatio: number,
    capacity: number,
): Point2d => {
    if (getIsRun(effectDefs)) {
        const push = Math.min(pushRatio * toCountedRoom(effectDefs, reach, growthRatio), capacity);

        return ProximityUtils.toRunDisplacement(effectDefs, -push);
    }

    const share = pushRatio * growthRatio;

    return effectDefs.spreadRule === "cartesian"
        ? toCartesianDisplacement(effectDefs, reach, share)
        : toCircularDisplacement(effectDefs, reach, share);
};

/**
 * The pointer effects this library ships, as factories a consumer can tune or take as they are.
 *
 * Each is a function from one item's measurements to CSS transform and filter values, which is the whole
 * of what an effect is — see {@link ProximityUtils}. What is worth reading them for is the different
 * answers they give to the reduced-motion preference, since the library never strips a response it thinks
 * is motion and leaves the substitution to whoever wrote the effect.
 */
export namespace ProximityEffectUtils {
    /**
     * Grows the items nearest the pointer and moves the rest aside to make the room.
     *
     * **The room made is the room the growth takes**, so at a `pushRatio` of `1` neighbors in a row or a
     * column part by exactly as much as they grew and never overlap — see {@link toCountedRoom}. Less than
     * `1` lets them overlap by the rest, and more opens gaps. An arrangement that is not an evenly spaced
     * run, such as a cliff or a honeycomb, grows the space round the pointer instead, in one of two ways its
     * layout chooses — see {@link toGivingWay}.
     *
     * **The push is clamped to the room the arrangement actually has.** A run that turns has only the
     * rest of its circle to spread into, and a ring has none at all — push its items along regardless
     * and the two directions travel round and collide at the far side. The clamp is half the slack,
     * since the two ends spread in opposite directions and each takes a share. That makes a closed run
     * the case where the clamp comes out at nothing rather than a case of its own. Under reduced motion
     * nothing grows or moves, and the nearest items brighten by the growth instead.
     *
     * @param defs How far the effect reaches, how much the nearest item grows, and how much of the room
     * that growth takes is made by moving the rest aside.
     * @returns The effect function, ready to hand to a control's `computeEffect`.
     */
    export const createZoomIn = (defs?: ZoomInDefs): ProximityEffectFn => {
        const base = ProximityEffectDefaults.ZOOM_IN_DEFAULTS;
        const reachRatio = defs?.reachRatio ?? base.reachRatio;
        const growthRatio = defs?.growthRatio ?? base.growthRatio;
        const pushRatio = defs?.pushRatio ?? base.pushRatio;

        return (effectDefs) => {
            const reach = reachRatio * effectDefs.spacing;
            const growth = WHOLE + growthRatio * ProximityUtils.getFalloff(effectDefs, reach);

            if (effectDefs.prefersReducedMotion) return { brightness: growth * PERCENT };

            const size = { scale: [growth * PERCENT, growth * PERCENT] };
            const capacity = effectDefs.slack * SHARED_ENDS;

            if (capacity < NO_DIRECTION || pushRatio < NO_DIRECTION) return size;

            return {
                ...size,
                translate: ProximityUtils.toTranslation(
                    effectDefs.frame,
                    toGivingWay(effectDefs, reach, growthRatio, pushRatio, capacity),
                ),
            };
        };
    };

    /** {@link createZoomIn} at its defaults. */
    export const zoomIn = createZoomIn();

    /**
     * Brightens and saturates the items nearest the pointer.
     *
     * The one sample that is not motion under success criterion
     * {@link https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html 2.3.3} — its own definition
     * excludes a change of color that does not change perceived size, shape or position — so it is also the one that
     * answers the reduced-motion preference by not changing.
     *
     * @param defs How far the effect reaches, and how much the nearest item brightens and saturates.
     * @returns The effect function, ready to hand to a control's `computeEffect`.
     */
    export const createGlow = (defs?: GlowDefs): ProximityEffectFn => {
        const base = ProximityEffectDefaults.GLOW_DEFAULTS;
        const reachRatio = defs?.reachRatio ?? base.reachRatio;
        const brightnessRatio = defs?.brightnessRatio ?? base.brightnessRatio;
        const saturationRatio = defs?.saturationRatio ?? base.saturationRatio;

        return (effectDefs) => {
            const reach = reachRatio * effectDefs.spacing;
            const falloff = ProximityUtils.getFalloff(effectDefs, reach);

            return {
                brightness: (WHOLE + brightnessRatio * falloff) * PERCENT,
                saturate: (WHOLE + saturationRatio * falloff) * PERCENT,
            };
        };
    };

    /** {@link createGlow} at its defaults. */
    export const glow = createGlow();

    /**
     * Pushes what is far from the pointer back, by dimming it and blurring it.
     *
     * The other way round from the rest: it picks an item out by taking the others away rather than by doing anything
     * to it. The blur is in pixels because a blur radius is the one quantity here that a layout cannot state —
     * everything else is a share of something the arrangement already knows. Under reduced motion the dimming stays and
     * the blur goes, the erratum to success criterion
     * {@link https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html 2.3.3} having brought
     * blurring inside it.
     *
     * @param defs How far the effect reaches, how much the farthest items dim, and how far they blur, in pixels.
     * @returns The effect function, ready to hand to a control's `computeEffect`.
     */
    export const createFade = (defs?: FadeDefs): ProximityEffectFn => {
        const base = ProximityEffectDefaults.FADE_DEFAULTS;
        const reachRatio = defs?.reachRatio ?? base.reachRatio;
        const opacityRatio = defs?.opacityRatio ?? base.opacityRatio;
        const blurPixels = defs?.blurPixels ?? base.blurPixels;

        return (effectDefs) => {
            const reach = reachRatio * effectDefs.spacing;
            const remoteness = WHOLE - ProximityUtils.getFalloff(effectDefs, reach);
            const opacity = (WHOLE - opacityRatio * remoteness) * PERCENT;

            if (effectDefs.prefersReducedMotion) return { opacity };

            return { opacity, blur: blurPixels * remoteness };
        };
    };

    /** {@link createFade} at its defaults. */
    export const fade = createFade();

    /**
     * Turns a registry entry into the effect it names.
     *
     * @param entry The family and, where it has been tuned, the defs to tune it by.
     * @returns The effect function, ready to hand to a control's `computeEffect`.
     */
    export const toEffectFn = (entry: ProximityEffectEntry): ProximityEffectFn => {
        switch (entry.family) {
            case "zoom_in":
                return createZoomIn(entry.defs);
            case "glow":
                return createGlow(entry.defs);
            case "fade":
                return createFade(entry.defs);
        }
    };
}
