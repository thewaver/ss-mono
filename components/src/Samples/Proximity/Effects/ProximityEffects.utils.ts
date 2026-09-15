import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import type { ProximityEffectFn } from "../../../Abstracts/Proximity/Proximity.types";
import { ProximityUtils } from "../../../Abstracts/Proximity/Proximity.utils";
import { ProximityEffectKnobs } from "./ProximityEffects.knobs";
import type { FadeDefs, GlowDefs, LiftDefs, ProximityEffectEntry, SwellDefs } from "./ProximityEffects.types";

const NOTHING = 0;
const WHOLE = 1;
const PERCENT = 100;
const NO_DIRECTION = 1e-6;
const SHARED_ENDS = 0.5;
const SPREAD_SLOPE = 1.5;
const SPREAD_CUBE = 0.5;

/**
 * How far along its full travel an item at a given distance has been pushed.
 *
 * A swelling item takes room from the run it sits in, and its neighbors have to give that room up:
 * an item's displacement is everything its inner neighbors grew by, which is the running total of
 * the falloff rather than the falloff itself. Integrating {@link ProximityUtils.getFalloff} and
 * scaling the result to end at `1` gives that shape in closed form — barely any movement right
 * beside the pointer, where there is nothing in between to have grown, rising to the whole push once
 * past the reach, where everything that was going to grow already has.
 */
const toSpreadShare = (distance: number, reach: number) => {
    if (reach < NO_DIRECTION) return NOTHING;

    const ratio = MathUtils.clamp01(distance / reach);

    return SPREAD_SLOPE * ratio - SPREAD_CUBE * ratio * ratio * ratio;
};

/** A displacement of a given length along a bearing. A negative length sends it the other way. */
const toDisplacement = (bearing: Point2d, length: number): Point2d => ({
    x: bearing.x * length,
    y: bearing.y * length,
});

/**
 * The pointer effects this library ships, as factories a consumer can tune or take as they are.
 *
 * Each is a function from one item's measurements to CSS transform and filter values, which is the whole
 * of what an effect is — see {@link ProximityUtils}. What is worth reading them for is the four different
 * answers they give to the reduced-motion preference, since the library never strips a response it thinks
 * is motion and leaves the substitution to whoever wrote the effect.
 */
export namespace ProximityEffectUtils {
    /**
     * Grows the items nearest the pointer and moves the rest aside to make the room.
     *
     * **The push is clamped to the room the arrangement actually has.** A run that turns has only the
     * rest of its circle to spread into, and a ring has none at all — push its items along regardless
     * and the two directions travel round and collide at the far side. The clamp is half the slack,
     * since the two ends spread in opposite directions and each takes a share. That makes a closed run
     * the case where the clamp comes out at nothing rather than a case of its own, and it is why
     * `pushRatio` can be asked for freely: an arrangement that cannot honor it says so.
     */
    export const createSwell = (defs?: SwellDefs): ProximityEffectFn => {
        const base = ProximityEffectKnobs.SWELL_DEFAULTS;
        const reachRatio = defs?.reachRatio ?? base.reachRatio;
        const growthRatio = defs?.growthRatio ?? base.growthRatio;
        const pushRatio = defs?.pushRatio ?? base.pushRatio;

        return (effectDefs) => {
            const reach = reachRatio * effectDefs.spacing;
            const growth = WHOLE + growthRatio * ProximityUtils.getFalloff(effectDefs, reach);

            if (effectDefs.prefersReducedMotion) return { brightness: growth * PERCENT };

            const size = { scale: [growth * PERCENT, growth * PERCENT] };
            const push = Math.min(pushRatio * effectDefs.placement.width, effectDefs.slack * SHARED_ENDS);

            if (push < NO_DIRECTION) return size;

            const spread = -push * toSpreadShare(effectDefs.distance, reach);

            return {
                ...size,
                translate: ProximityUtils.toTranslation(
                    effectDefs.frame,
                    ProximityUtils.toRunDisplacement(effectDefs, spread),
                ),
            };
        };
    };

    /** {@link createSwell} at its defaults. */
    export const swell = createSwell();

    /**
     * Leans the items nearest the pointer toward it, without changing their size.
     *
     * The one sample that is nothing but movement, which is why it answers the reduced-motion preference
     * by doing nothing at all: there is no other channel for it to say the same thing in. A negative
     * `shiftRatio` makes it a repulsion.
     */
    export const createLift = (defs?: LiftDefs): ProximityEffectFn => {
        const base = ProximityEffectKnobs.LIFT_DEFAULTS;
        const reachRatio = defs?.reachRatio ?? base.reachRatio;
        const shiftRatio = defs?.shiftRatio ?? base.shiftRatio;

        return (effectDefs) => {
            if (effectDefs.prefersReducedMotion) return {};

            const reach = reachRatio * effectDefs.spacing;
            const shift = shiftRatio * effectDefs.placement.width * ProximityUtils.getFalloff(effectDefs, reach);

            return {
                translate: ProximityUtils.toTranslation(
                    effectDefs.frame,
                    toDisplacement(ProximityUtils.getPointerBearing(effectDefs), shift),
                ),
            };
        };
    };

    /** {@link createLift} at its defaults. */
    export const lift = createLift();

    /**
     * Brightens and saturates the items nearest the pointer.
     *
     * The one sample that is not motion under success criterion 2.3.3 — its own definition excludes a
     * change of color that does not change perceived size, shape or position — so it is also the one
     * that answers the reduced-motion preference by not changing.
     */
    export const createGlow = (defs?: GlowDefs): ProximityEffectFn => {
        const base = ProximityEffectKnobs.GLOW_DEFAULTS;
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
     * The other way round from the rest: it picks an item out by taking the others away rather than by
     * doing anything to it. The blur is in pixels because a blur radius is the one quantity here that a
     * layout cannot state — everything else is a share of something the arrangement already knows.
     * Under reduced motion the dimming stays and the blur goes, the erratum to success criterion 2.3.3
     * having brought blurring inside it.
     */
    export const createFade = (defs?: FadeDefs): ProximityEffectFn => {
        const base = ProximityEffectKnobs.FADE_DEFAULTS;
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
            case "swell":
                return createSwell(entry.defs);
            case "lift":
                return createLift(entry.defs);
            case "glow":
                return createGlow(entry.defs);
            case "fade":
                return createFade(entry.defs);
        }
    };
}
