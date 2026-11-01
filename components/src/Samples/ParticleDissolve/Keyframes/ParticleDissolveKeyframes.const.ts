import { RandomUtils } from "@thewaver/ss-utils";

import type {
    SliceAnimationFn,
    SliceStop,
} from "../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

const RISE_MIN = 300;
const RISE_SPREAD = 500;
const DRIFT_SPREAD = 400;
const FULL = 100;
const SHRINK = 50;
const RISE_SEED = 1;
const DRIFT_SEED = 2;
const HALF = 0.5;

export namespace ParticleDissolveKeyframes {
    /**
     * Ash: every particle rises, drifts a little to one side, shrinks to half and fades out.
     *
     * How far each one rises and drifts is drawn from its place in the grid, so the same cell does the same thing on
     * every pass and in every frame a scrub draws. Each call makes a fresh animation with its own memory of the
     * cells; build it once and hand the same one to the component.
     *
     * @returns The animation, for `ParticleDissolveProps.computeParticleAnimation`.
     */
    export const createAsh = (): SliceAnimationFn => {
        const byKey = new Map<number, SliceStop[]>();

        return SliceAnimationKeyframeUtils.fromSlices(({ pos, count }) => {
            const key = pos.row * count.col + pos.col;
            const existing = byKey.get(key);

            if (existing) return existing;

            const stops: SliceStop[] = [
                { at: 0, translateX: 0, translateY: 0, scaleX: FULL, scaleY: FULL, opacity: FULL },
                {
                    at: 1,
                    translateX: (RandomUtils.hash(key, DRIFT_SEED) - HALF) * DRIFT_SPREAD,
                    translateY: -(RISE_MIN + RandomUtils.hash(key, RISE_SEED) * RISE_SPREAD),
                    scaleX: FULL - SHRINK,
                    scaleY: FULL - SHRINK,
                    opacity: 0,
                },
            ];

            byKey.set(key, stops);

            return stops;
        });
    };
}
