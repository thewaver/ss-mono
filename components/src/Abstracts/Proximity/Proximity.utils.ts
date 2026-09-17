import { AngleUtils, MathUtils, Point2d, Point2dUtils } from "@thewaver/ss-utils";

import type { PlacementLayout, PlacementRect } from "../Placement/Placement.types";
import { PlacementUtils } from "../Placement/Placement.utils";
import type { ProximityArrangement, ProximityEffectDefs } from "./Proximity.types";

const NOTHING = 0;
const WHOLE = 1;
const PERCENT = 100;
const NO_DIRECTION = 1e-6;

/**
 * How far off the band the pointer sits, as a share of the run's own radius.
 *
 * `0` on the band, `1` at the pivot and `1` again as far outside the band as the pivot is inside it,
 * which is the whole of the room there is to move radially. An arrangement that does not turn has no
 * band to be off, and answers `0` everywhere.
 */
const toRadialShare = (arrangement: ProximityArrangement, point: Point2d) => {
    if (arrangement.reachRule !== "arc" || arrangement.origin === undefined || arrangement.radius < NO_DIRECTION) {
        return NOTHING;
    }

    const reach = Point2dUtils.getLength(Point2d.sub(point, arrangement.origin)!);

    return MathUtils.clamp01(Math.abs(reach - arrangement.radius) / arrangement.radius);
};

/**
 * Turns a placed item's nearness to the pointer into transforms and filters.
 *
 * A component that lays its items out with {@link PlacementUtils} knows where each one sits and where
 * the pointer is, both in the same layout coordinates; what it does not know is what the consumer
 * wants that to look like. An effect function is given one item's measurements against the pointer
 * and answers with CSS function values, so a zoom, a glow and a nudge are the same mechanism with a
 * different answer.
 *
 * Every length here is in layout units — fractions of the container's width — so an effect written
 * against an item's own size behaves the same at any rendered size.
 */
export namespace ProximityUtils {
    /**
     * How strongly one item should be affected.
     *
     * Falls off as the square of how near the pointer is rather than linearly, so the item the pointer is
     * on is plainly the one picked out while its neighbors still respond: at half the reach the answer is
     * `0.75` rather than `0.5`. Meeting the reach exactly gives nothing, and there is no discontinuity at
     * the edge to see.
     *
     * **The reach is the caller's along the run and the arrangement's across it.** How far round a ring
     * an effect should carry is a matter of taste, so it is a number the caller picks; how far in or out
     * it can carry is not, because the space is bounded — a pointer cannot travel further in than the
     * pivot. So the radial part spans exactly the run's own radius, which gives a turning arrangement the
     * one profile that is right: nothing at the pivot, everything on the band, and nothing again as far
     * outside the band as the pivot was inside it. An arrangement that does not turn has no radial part
     * and this is the distance alone.
     *
     * @param defs The item's measurements.
     * @param reach How far along the run the effect carries, in layout units.
     * @returns `1` under the pointer, falling to `0` at the reach and staying there beyond it.
     */
    export const getFalloff = (defs: ProximityEffectDefs, reach: number) => {
        if (reach < NO_DIRECTION) return NOTHING;

        const nearness = MathUtils.clamp01(Math.hypot(defs.distance / reach, defs.radialShare));

        return WHOLE - nearness * nearness;
    };

    /**
     * Everything about an arrangement that an effect measures itself against.
     *
     * Taken once per layout rather than per item, since none of it varies between the items in one run.
     *
     * @param layout The arrangement being drawn.
     * @returns The rule it measures nearness by, the pivot that rule turns about and the bearing of the
     * run's own middle, its `spacing`, how far out from the pivot its items sit, and how much room it has
     * left to spread into.
     */
    export const toArrangement = (layout: PlacementLayout): ProximityArrangement => ({
        reachRule: layout.reachRule,
        origin: layout.origin,
        facing: layout.reachRule === "arc" ? PlacementUtils.getRunFacing(layout) : undefined,
        spacing: PlacementUtils.getSpacing(layout),
        radius: PlacementUtils.getRunRadius(layout),
        slack: PlacementUtils.getRunSlack(layout),
    });

    /**
     * Measures one placed item against the pointer.
     *
     * @param placement The item's box, in layout coordinates.
     * @param point The pointer, in the same coordinates.
     * @param arrangement What the run it sits in is like, from {@link toArrangement}.
     * @param prefersReducedMotion Whether the user has asked for reduced motion, passed on so the
     * effect can answer with something other than movement rather than being silently stripped.
     * @param frame The box the effect's own transform will be written onto. It is the item's own box
     * wherever an item is its own element, and something larger where it is not — a wheel paints each of
     * its wedges across the whole wheel, so a translation there is of the wheel. Defaults to the
     * placement, which is the common case.
     * @param overreach How far past the run's own span the pointer sits — see
     * {@link PlacementUtils.getRunOverreach}. Defaults to `0`, which is what a caller with only one item
     * to measure should leave it at, there being no "past the run" for a run of one. A caller measuring
     * a whole run should pass the same value to every item in it.
     * @returns `offset`, the true vector from the item's center to the pointer, `radialShare` — how far
     * off the band the pointer sits, as a share of the run's own radius, which is `0` everywhere an
     * arrangement does not turn — and `distance`, which is
     * **not** that vector's length but how far the arrangement itself counts the pointer as being — see
     * {@link PlacementUtils.getReachDistance}. `ratio` is the one literal measure of the two: the straight
     * line divided by how far the item's own border reaches that way, so below `1` means the pointer is
     * genuinely over the item whatever its size. Everything the arrangement said about itself comes
     * through beside them.
     */
    export const toEffectDefs = (
        placement: PlacementRect,
        point: Point2d,
        arrangement: ProximityArrangement,
        prefersReducedMotion: boolean,
        frame: PlacementRect = placement,
        overreach = NOTHING,
    ): ProximityEffectDefs => {
        const center = PlacementUtils.getCenter(placement);
        const offset = { x: point.x - center.x, y: point.y - center.y };
        const straight = Math.hypot(offset.x, offset.y);
        const distance = PlacementUtils.getReachDistance(arrangement, center, point);
        const radialShare = toRadialShare(arrangement, point);

        if (straight < NO_DIRECTION) {
            return {
                ...arrangement,
                placement,
                frame,
                offset,
                distance,
                overreach,
                radialShare,
                ratio: NOTHING,
                prefersReducedMotion,
            };
        }

        const direction = { x: offset.x / straight, y: offset.y / straight };
        const border = PlacementUtils.getBorderDistance(placement, direction);

        return {
            ...arrangement,
            placement,
            frame,
            offset,
            distance,
            overreach,
            radialShare,
            ratio: border < NO_DIRECTION ? Infinity : straight / border,
            prefersReducedMotion,
        };
    };

    /**
     * Measures an item as though the pointer were nowhere near the run at all.
     *
     * A control stops tracking the pointer the instant it leaves the layout's own box, or has never been
     * seen yet, and until now that meant no effect ran at all — the element's `transform` and `filter`
     * went from whatever they were mid-approach straight to nothing, a different-shaped value with
     * nothing for a transition to ease between. Calling the same effect function with this instead keeps
     * the shape identical to an engaged reading, at whatever values the effect settles to on its own once
     * nothing is near — full brightness for `glow`, but dimmed for `fade`, since dimming what is far is
     * `fade`'s whole idea and nothing being near is the far end of that.
     *
     * @param placement The item's box, in layout coordinates.
     * @param arrangement What the run it sits in is like, from {@link toArrangement}.
     * @param prefersReducedMotion Whether the user has asked for reduced motion.
     * @param frame The box the effect's own transform will be written onto — see {@link toEffectDefs}.
     * @returns Measurements reporting the pointer as infinitely far away on every axis that matters.
     */
    export const toRestingEffectDefs = (
        placement: PlacementRect,
        arrangement: ProximityArrangement,
        prefersReducedMotion: boolean,
        frame: PlacementRect = placement,
    ): ProximityEffectDefs => ({
        ...arrangement,
        placement,
        frame,
        offset: { x: NOTHING, y: NOTHING },
        distance: Infinity,
        overreach: Infinity,
        radialShare: NOTHING,
        ratio: Infinity,
        prefersReducedMotion,
    });

    /**
     * Which way the pointer lies from an item, in a straight line.
     *
     * @param defs The item's measurements.
     * @returns A unit vector, or no direction at all when the pointer is on the item's own center, where
     * it does not lie any way from it.
     */
    export const getPointerBearing = (defs: ProximityEffectDefs): Point2d => {
        const straight = Math.hypot(defs.offset.x, defs.offset.y);

        return straight < NO_DIRECTION
            ? { x: NOTHING, y: NOTHING }
            : { x: defs.offset.x / straight, y: defs.offset.y / straight };
    };

    /**
     * Which way an item can travel along the run it sits in, toward the pointer.
     *
     * The arrangement's own rule read as a direction — see {@link PlacementUtils.getReachBearing}. An
     * item giving way should give way along its run and nowhere else: a row's item sideways, a ring's
     * around its own center. It is {@link getPointerBearing} only where the arrangement has no shape to
     * speak of.
     *
     * @param defs The item's measurements.
     * @returns A unit vector, or no direction at all where the pointer does not lie along the run.
     */
    export const getRunBearing = (defs: ProximityEffectDefs): Point2d => {
        const center = PlacementUtils.getCenter(defs.placement);

        return PlacementUtils.getReachBearing(defs, center, {
            x: center.x + defs.offset.x,
            y: center.y + defs.offset.y,
        });
    };

    /**
     * How far and which way to move an item so that it travels a given distance along its run.
     *
     * A straight step along the tangent is only the first term of travelling along a curve, and an item
     * giving way to a growing neighbor travels far enough for the rest of the terms to matter: on a
     * half-turn arc of six, a push of three quarters of an item width is a twenty-seven degree step, and
     * a straight tangent leaves the curve far enough that neighbors converge and overlap. So where the
     * run turns, this turns with it — the item is swung about the arrangement's pivot by the angle that
     * distance is worth at its own radius, and what comes back is the chord. Every item stays on the
     * curve and their spacing is preserved exactly.
     *
     * @param defs The item's measurements.
     * @param length How far to travel, toward the pointer along the run. A negative length travels the
     * other way, which is what giving way is.
     * @returns The displacement in layout units, ready for {@link toTranslation}.
     */
    export const toRunDisplacement = (defs: ProximityEffectDefs, length: number): Point2d => {
        const center = PlacementUtils.getCenter(defs.placement);
        const origin = defs.origin;

        if (defs.reachRule === "arc" && origin !== undefined) {
            const radius = Math.hypot(center.x - origin.x, center.y - origin.y);

            if (radius < NO_DIRECTION) return { x: NOTHING, y: NOTHING };

            const arm = { x: center.x - origin.x, y: center.y - origin.y };
            const tangent = { x: -arm.y / radius, y: arm.x / radius };
            const bearing = getRunBearing(defs);
            const way = Math.sign(bearing.x * tangent.x + bearing.y * tangent.y);
            const radians = (way * length) / radius;
            const cos = Math.cos(radians);
            const sin = Math.sin(radians);

            return {
                x: arm.x * cos - arm.y * sin - arm.x,
                y: arm.x * sin + arm.y * cos - arm.y,
            };
        }

        const bearing = getRunBearing(defs);

        return { x: bearing.x * length, y: bearing.y * length };
    };

    /**
     * Writes a displacement as the arguments of a CSS `translate`.
     *
     * Two conversions the caller should not have to remember. A translation given in percent is of the
     * element's own width and height rather than of the container, so each axis is divided by the item's
     * own extent; and it is applied after the item's rotation, so a displacement meant to point one way
     * across the layout would come out turned by whatever the item is turned by. Both are undone here,
     * which means the vector goes in as it is meant to look.
     *
     * @param frame The box carrying the transform — `defs.frame`, which is not always the item's own
     * placement.
     * @param displacement Where to move it, in layout units, along the layout's own axes.
     * @returns The two percentages, in the order `translate` takes them. A zero comes back positive,
     * so a style never reads `-0%`.
     */
    export const toTranslation = (frame: PlacementRect, displacement: Point2d) => {
        const radians = -(frame.angle ?? NOTHING) * AngleUtils.RADIANS_PER_DEGREE;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const along = displacement.x * cos - displacement.y * sin;
        const across = displacement.x * sin + displacement.y * cos;
        const toPercent = (value: number, extent: number) =>
            extent < NO_DIRECTION || value === NOTHING ? NOTHING : (value / extent) * PERCENT;

        return [toPercent(along, frame.width), toPercent(across, frame.height)];
    };
}
