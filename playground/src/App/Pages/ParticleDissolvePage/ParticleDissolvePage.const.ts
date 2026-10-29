import { SliceAnimationKeyframeUtils } from "@thewaver/ss-components";
import type { SliceStop } from "@thewaver/ss-components";
import { RandomUtils } from "@thewaver/ss-utils";

import { ParticlePictureUtils } from "../../PageComponents/ParticlePicture/ParticlePicture.utils";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";

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
    stressTest: "Stress Test",
};

export const STRESS_CELL_SIZE = 4;

export const STRESS_ITEMS: StressTestDefs[] = [
    { count: 3 * 2, cols: 3, gap: 10 },
    { count: 4 * 3, cols: 4, gap: 10 },
    { count: 5 * 4, cols: 5, gap: 10 },
];

export const EXAMPLES_ROOT = "/src/App/Pages/ParticleDissolvePage/Examples";

export const FIELD_WIDTH = 110;

export const PARTICLE_SHARE = 0.6;

const ASH_COLOR = "#ffffff";

export const SVG_SIZE = { width: 200, height: 200 };

export const SVG_LABEL = "N∅THING";

export const CARD_TEXT = {
    title: "Quarterly report",
    body: "Revenue grew in every region, and the notes below explain the two that did not.",
    badge: "Approved",
};

export const NO_EDGE_THICKNESSES = [0];

export const CENTER_SHARE = { x: 0.5, y: 0.5 };

const createAshAnimation = () => {
    const byKey = new Map<number, SliceStop[]>();

    return SliceAnimationKeyframeUtils.fromSlices(({ pos, count }) => {
        const key = pos.row * count.col + pos.col;
        const existing = byKey.get(key);

        if (existing) return existing;

        const stops: SliceStop[] = [
            { at: 0, translateX: 0, translateY: 0, scaleX: FULL, scaleY: FULL, opacity: FULL },
            {
                at: 1,
                translateX: (RandomUtils.hash(key, DRIFT_SEED) - 0.5) * DRIFT_SPREAD,
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

export const ASH_ANIMATION = createAshAnimation();

export const ASH_SRC = ParticlePictureUtils.createDotSrc(ASH_COLOR, ASH_COLOR, { fillShare: PARTICLE_SHARE });
