import type { ParticleTravelDefs } from "@thewaver/ss-components";
import type { CSSAnimationValues } from "@thewaver/ss-utils";

import { ParticlePictureUtils } from "../../PageComponents/ParticlePicture/ParticlePicture.utils";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";

import { themeVars } from "../../Theme.css";
import { PARTICLE_SIZE_PX } from "./ParticleSpawnerPage.css";

const FADE_IN_SHARE = 0.15;
const PERCENT = 100;
const ARRIVAL_SCALE = 0.5;
const TINTABLE_LIGHT = "white";
const TINTABLE_DARK = "gray";

const computeParticleGlow = (defs: ParticleTravelDefs, t: number) => ({
    opacity: defs.legIndex === 0 && t < FADE_IN_SHARE ? t / FADE_IN_SHARE : 1,
    scale: defs.legIndex === defs.legCount - 1 ? 1 + t * ARRIVAL_SCALE : 1,
});

export const computeParticleAnimation = (defs: ParticleTravelDefs, t: number): CSSAnimationValues => {
    const glow = computeParticleGlow(defs, t);

    return { opacity: glow.opacity * PERCENT, scale: [glow.scale * PERCENT, glow.scale * PERCENT] };
};

export const createParticleSrc = () =>
    ParticlePictureUtils.createDotSrc(themeVars.color.primary.light, themeVars.color.primary.dark, {
        sizePx: PARTICLE_SIZE_PX,
    });

export const createTintableParticleSrc = () =>
    ParticlePictureUtils.createDotSrc(TINTABLE_LIGHT, TINTABLE_DARK, { sizePx: PARTICLE_SIZE_PX });

export const createLegTints = () => [
    ParticlePictureUtils.resolveColor(themeVars.color.primary.main),
    ParticlePictureUtils.resolveColor(themeVars.color.secondary.main),
];

export const EXAMPLE_NAMES = {
    singleTarget: "Single target",
    vertical: "Vertical",
    diagonal: "Diagonal",
    movingTarget: "Moving target",
    radial: "Radial (1 spawner, many targets)",
    manyToOne: "Many to one (many spawners, 1 target)",
    roundTrip: "Round trip",
    wind: "Wind",
    attraction: "Attraction",
    multipleTargets: "Multiple targets",
    grid: "N spawners x M targets",
    stressTest: "Stress Test",
};

export const EXAMPLES_ROOT = "/src/App/Pages/ParticleSpawnerPage/Examples";

export const FIELD_WIDTH = 130;

export const NO_TRAVEL_DEFS: Record<string, number | boolean> = {};

export const BOX_WIDTH = 420;

export const BOX_HEIGHT = 260;

export const STRESS_ITEM_SIZE = 120;

export const STRESS_SPAWN_DELAY_MS = 0;

export const STRESS_PARTICLE_COUNT = 60;

export const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
    { count: 4 * 3, cols: 4, gap: 10, size: STRESS_ITEM_SIZE },
    { count: 6 * 4, cols: 6, gap: 10, size: STRESS_ITEM_SIZE },
    { count: 8 * 6, cols: 8, gap: 10, size: STRESS_ITEM_SIZE },
    { count: 12 * 6, cols: 12, gap: 10, size: STRESS_ITEM_SIZE },
];
