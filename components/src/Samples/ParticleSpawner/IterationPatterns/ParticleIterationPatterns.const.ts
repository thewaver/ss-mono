import type { ParticleSpawnIterationPattern } from "../../../Exotics/Particles/ParticleSpawner/ParticleSpawner.types";
import type { ParticleIterationPatternType } from "./ParticleIterationPatterns.types";

const BURST_SHOT_COUNT = 3;
const BURST_PAUSE_MS = 600;
const INTERMITTENT_PAUSE_MS = 500;
const NO_PAUSE_MS = 0;
const SELF = 0;

export namespace ParticleIterationPatterns {
    export const SAMPLE_PATTERNS: Record<ParticleIterationPatternType, ParticleSpawnIterationPattern[]> = {
        burst: [{ count: BURST_SHOT_COUNT, beginDelayMs: BURST_PAUSE_MS, nextIndex: SELF }],
        intermittent: [{ count: 1, beginDelayMs: INTERMITTENT_PAUSE_MS, nextIndex: SELF }],
        continuous: [{ count: 1, beginDelayMs: NO_PAUSE_MS, nextIndex: SELF }],
    };

    export const PATTERN_TYPES = Object.keys(SAMPLE_PATTERNS) as ParticleIterationPatternType[];
}
