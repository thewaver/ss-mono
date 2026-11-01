import { MathUtils } from "@thewaver/ss-utils";

import type {
    ParticleModifier,
    ParticleTravelDefs,
} from "../../Exotics/Particles/ParticleSpawner/ParticleSpawner.types";
import { ParticleModifierDefaults } from "./ParticleModifiers.const";
import type { ParticleAttractionDefs, ParticleWindDefs } from "./ParticleModifiers.types";

const WHOLE = 1;
const GOLDEN_FRACTION = 0.618033988749895;

const toLegEnvelope = (t: number) => Math.sin(MathUtils.clamp01(t) * Math.PI);

const toPhase = (id: number) => (id * GOLDEN_FRACTION) % WHOLE;

/**
 * Factories for `ParticleSpawner`'s `particleModifiers`: forces that act on every path alike, whatever
 * `computeParticlePos` draws.
 *
 * Each answers from the particle, the leg and the time since it set off alone, so a scrub draws the same picture at
 * the same point, and each leaves a particle where its path put it while the reader asks for reduced motion.
 */
export namespace ParticleModifierUtils {
    /**
     * Blows particles sideways off their paths, in gusts.
     *
     * The push is strongest mid-leg and nothing at either end, so particles still land on their stops. Its strength
     * swings with time on a cycle, each particle at its own point of the cycle, so a round streams rather than moving
     * as one block.
     *
     * @param defs.directionDegrees Which way the wind blows, in degrees clockwise from rightward on the screen.
     * @param defs.strengthPixels How far a particle is carried at the middle of a leg between gusts.
     * @param defs.gustRatio How much the strength swings above and below that, as a share of it, `0`–`1`. `0` is a
     * steady wind.
     * @param defs.gustPeriodMs How long one gust takes to come and go.
     * @returns The modifier, ready to put in `particleModifiers`.
     */
    export const createWind = (defs?: ParticleWindDefs): ParticleModifier => {
        const base = ParticleModifierDefaults.WIND_DEFAULTS;
        const radians = ((defs?.directionDegrees ?? base.directionDegrees) * Math.PI) / 180;
        const strengthPixels = defs?.strengthPixels ?? base.strengthPixels;
        const gustRatio = MathUtils.clamp01(defs?.gustRatio ?? base.gustRatio);
        const gustPeriodMs = defs?.gustPeriodMs ?? base.gustPeriodMs;
        const direction = { x: Math.cos(radians), y: Math.sin(radians) };

        return (pos, travel, t, elapsedMs) => {
            if (travel.prefersReducedMotion) return pos;

            const cycle = gustPeriodMs > 0 ? elapsedMs / gustPeriodMs : 0;
            const gust = WHOLE + gustRatio * Math.sin((cycle + toPhase(travel.id)) * Math.PI * 2);
            const push = strengthPixels * gust * toLegEnvelope(t);

            return { x: pos.x + direction.x * push, y: pos.y + direction.y * push };
        };
    };

    /**
     * Draws particles toward a point, or toward one of the spawner's `modMarkers`, as they pass near it, as a magnet
     * would.
     *
     * The pull falls away with distance and stops at `reachPixels`, so only particles passing close are bent; it is
     * strongest mid-leg and nothing at either end, so particles still land on their stops.
     *
     * @param defs.offset Where the pull comes from, in pixels from the spawner's center — the same space as
     * `ParticleTravelDefs.origin`, so it stays put on every leg of a route. Give this or `modMarkerIndex`.
     * @param defs.modMarkerIndex Which of the spawner's `modMarkers` the pull comes from, measured every frame, so the
     * pull follows the element wherever it moves. While that element is not on the page nothing is pulled.
     * @param defs.strengthRatio How much of the way to the point a particle passing right by it is drawn, `0`–`1`.
     * @param defs.reachPixels How far from the point the pull is felt at all.
     * @returns The modifier, ready to put in `particleModifiers`.
     */
    export const createAttraction = (defs: ParticleAttractionDefs): ParticleModifier => {
        const base = ParticleModifierDefaults.ATTRACTION_DEFAULTS;
        const strengthRatio = MathUtils.clamp01(defs.strengthRatio ?? base.strengthRatio);
        const reachPixels = defs.reachPixels ?? base.reachPixels;

        const toCenter = (travel: ParticleTravelDefs) =>
            defs.offset
                ? { x: travel.origin.x + defs.offset.x, y: travel.origin.y + defs.offset.y }
                : travel.modMarkers[defs.modMarkerIndex];

        return (pos, travel, t) => {
            const center = toCenter(travel);

            if (!center || travel.prefersReducedMotion || reachPixels <= 0) return pos;

            const dx = center.x - pos.x;
            const dy = center.y - pos.y;
            const distanceShare = Math.hypot(dx, dy) / reachPixels;

            if (distanceShare >= WHOLE) return pos;

            const pull = strengthRatio * (WHOLE - distanceShare * distanceShare) * toLegEnvelope(t);

            return { x: pos.x + dx * pull, y: pos.y + dy * pull };
        };
    };
}
