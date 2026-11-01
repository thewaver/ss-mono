import { ParticleDissolveKeyframes } from "@thewaver/ss-components";

import { ParticlePictureUtils } from "../../PageComponents/ParticlePicture/ParticlePicture.utils";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";

export const EXAMPLE_NAMES = {
    button: "A button",
    card: "A card",
    svg: "An SVG",
    image: "An image",
    stressTest: "Stress Test",
};

export const STRESS_CELL_SIZE = 8;

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

export const ASH_ANIMATION = ParticleDissolveKeyframes.createAsh();

export const ASH_SRC = ParticlePictureUtils.createDotSrc(ASH_COLOR, ASH_COLOR, { fillShare: PARTICLE_SHARE });
