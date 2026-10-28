import type { ParticleDissolveParticleDefs } from "@thewaver/ss-components";
import { type CSSAnimationValues, RandomUtils } from "@thewaver/ss-utils";

const RISE_MIN = 300;
const RISE_SPREAD = 500;
const DRIFT_SPREAD = 400;
const FULL = 100;
const SHRINK = 50;
const RISE_SEED = 1;
const DRIFT_SEED = 2;

export const EXAMPLE_NAMES = {
    button: "A button",
    card: "A card",
    svg: "An SVG",
    image: "An image",
};

export const EXAMPLES_ROOT = "/src/App/Pages/ParticleDissolvePage/Examples";

export const FIELD_WIDTH = 110;

export const PARTICLE_SHARE = 0.6;

export const SVG_SIZE = { width: 200, height: 200 };

export const SVG_LABEL = "N∅THING";

export const CARD_TEXT = {
    title: "Quarterly report",
    body: "Revenue grew in every region, and the notes below explain the two that did not.",
    badge: "Approved",
};

export const NO_EDGE_THICKNESSES = [0];

export const CENTER_SHARE = { x: 0.5, y: 0.5 };

export const computeAshAnimation = (defs: ParticleDissolveParticleDefs, t: number): CSSAnimationValues => {
    const key = defs.cell.pos.row * defs.cell.count.col + defs.cell.pos.col;

    return {
        translateX: (RandomUtils.hash(key, DRIFT_SEED) - 0.5) * DRIFT_SPREAD * t,
        translateY: -(RISE_MIN + RandomUtils.hash(key, RISE_SEED) * RISE_SPREAD) * t,
        scale: [FULL - SHRINK * t, FULL - SHRINK * t],
        opacity: FULL * (1 - t),
    };
};
