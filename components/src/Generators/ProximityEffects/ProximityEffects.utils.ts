import { MathUtils } from "@thewaver/ss-utils";

import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import { ProximityUtils } from "../../Abstracts/Proximity/Proximity.utils";
import { ProximityEffectDefaults } from "./ProximityEffects.const";
import type { FadeDefs, GlowDefs, ProximityEffectEntry, ZoomInDefs } from "./ProximityEffects.types";

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
 * A growing item takes room from the run it sits in, and its neighbors have to give that room up:
 * an item's displacement is everything its inner neighbors grew by, which is the running total of
 * the falloff rather than the falloff itself. Integrating {@link ProximityUtils.getFalloff} and
 * scaling the result to end at `1` gives that shape in closed form — barely any movement right
 * beside the pointer, where there is nothing in between to have grown, rising to the whole push once
 * past the reach, where everything that was going to grow already has.
 */
const toSpreadShareAt = (distance: number, reach: number) => {
    if (reach < NO_DIRECTION) return NOTHING;

    const ratio = MathUtils.clamp01(distance / reach);

    return SPREAD_SLOPE * ratio - SPREAD_CUBE * ratio * ratio * ratio;
};

/**
 * How much of an item's push is real, once the stretch of nothing past the run's own end is discounted.
 *
 * {@link toSpreadShareAt} alone assumes the run has something growing everywhere from the pointer's own
 * position outward, which is only true while the pointer is actually near the run. Once it drifts past
 * the run's own end, every item reads itself as "a full reach past the pointer" and inherits the whole
 * push regardless — the run shifts as one block with nothing in it actually growing. Subtracting the
 * share already spent by the time the run's own edge is reached leaves only the growth that happened
 * *inside* the run, which is nothing once even that edge is out of reach — and nothing at all while the
 * pointer is somewhere inside the run, `overreach` being `0` there.
 */
const toSpreadShare = (distance: number, overreach: number, reach: number) =>
    toSpreadShareAt(distance, reach) - toSpreadShareAt(overreach, reach);

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
     * **The push is clamped to the room the arrangement actually has.** A run that turns has only the
     * rest of its circle to spread into, and a ring has none at all — push its items along regardless
     * and the two directions travel round and collide at the far side. The clamp is half the slack,
     * since the two ends spread in opposite directions and each takes a share. That makes a closed run
     * the case where the clamp comes out at nothing rather than a case of its own, and it is why
     * `pushRatio` can be asked for freely: an arrangement that cannot honor it says so.
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
            const push = Math.min(pushRatio * effectDefs.placement.width, effectDefs.slack * SHARED_ENDS);

            if (push < NO_DIRECTION) return size;

            const spread = -push * toSpreadShare(effectDefs.distance, effectDefs.overreach, reach);

            return {
                ...size,
                translate: ProximityUtils.toTranslation(
                    effectDefs.frame,
                    ProximityUtils.toRunDisplacement(effectDefs, spread),
                ),
            };
        };
    };

    /** {@link createZoomIn} at its defaults. */
    export const zoomIn = createZoomIn();

    /**
     * Brightens and saturates the items nearest the pointer.
     *
     * The one sample that is not motion under success criterion 2.3.3 — its own definition excludes a
     * change of color that does not change perceived size, shape or position — so it is also the one
     * that answers the reduced-motion preference by not changing.
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
     * The other way round from the rest: it picks an item out by taking the others away rather than by
     * doing anything to it. The blur is in pixels because a blur radius is the one quantity here that a
     * layout cannot state — everything else is a share of something the arrangement already knows.
     * Under reduced motion the dimming stays and the blur goes, the erratum to success criterion 2.3.3
     * having brought blurring inside it.
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
            case "zoomIn":
                return createZoomIn(entry.defs);
            case "glow":
                return createGlow(entry.defs);
            case "fade":
                return createFade(entry.defs);
        }
    };
}
