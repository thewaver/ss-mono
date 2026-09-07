import { MathUtils } from "@thewaver/ss-utils";

import { PointerTracker } from "../../../../Abstracts/PointerTracker/PointerTracker";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { SVGDefsColors, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

type FlareGhost = {
    reach: number;
    scale: number;
    alpha: number;
    colorKey: keyof SVGDefsColors;
    isRing?: boolean;
};

const POOL_SCALE = 1.5;
const CORE_STOP = 5;
const FALLOFF_STOP = 40;
const CORE_ALPHA = 0.75;
const FALLOFF_ALPHA = 0.25;

const GHOSTS: FlareGhost[] = [
    { reach: 0.36, scale: 0.34, alpha: 0.1, colorKey: "primary" },
    { reach: 0.62, scale: 0.13, alpha: 0.18, colorKey: "primary" },
    { reach: 0.95, scale: 0.52, alpha: 0.08, colorKey: "secondary", isRing: true },
    { reach: 1.18, scale: 0.19, alpha: 0.15, colorKey: "secondary" },
    { reach: 1.44, scale: 0.1, alpha: 0.2, colorKey: "tertiary" },
    { reach: 1.72, scale: 0.66, alpha: 0.07, colorKey: "tertiary", isRing: true },
    { reach: 2, scale: 0.26, alpha: 0.13, colorKey: "tertiary" },
];

const GHOST_SATURATION = 0.55;
const GHOST_LUMINOSITY = 1.25;
const GHOST_NEAR_GROWTH = 1;
const GHOST_FAR_GROWTH = 0.55;

const DISC_STOPS = [45, 78];
const DISC_ALPHA_RATIOS = [1, 0.3];
const RING_STOPS = [55, 82, 92];
const RING_ALPHA_RATIOS = [0.12, 1, 0.2];

const NO_REF = () => undefined;

const toGhostColor = (color: string, alpha: number) =>
    `hsl(from ${color} h calc(s * ${GHOST_SATURATION}) calc(l * ${GHOST_LUMINOSITY}) / ${alpha})`;

const computeGhostColors = (ghost: FlareGhost, color: string, fade: number) => {
    const alpha = ghost.alpha * fade;

    if (ghost.isRing) {
        return [
            { value: toGhostColor(color, 0) },
            { value: toGhostColor(color, alpha * RING_ALPHA_RATIOS[0]), stop: RING_STOPS[0] },
            { value: toGhostColor(color, alpha * RING_ALPHA_RATIOS[1]), stop: RING_STOPS[1] },
            { value: toGhostColor(color, alpha * RING_ALPHA_RATIOS[2]), stop: RING_STOPS[2] },
            { value: toGhostColor(color, 0), stop: 100 },
        ];
    }

    return [
        { value: toGhostColor(color, alpha * DISC_ALPHA_RATIOS[0]) },
        { value: toGhostColor(color, alpha * DISC_ALPHA_RATIOS[0]), stop: DISC_STOPS[0] },
        { value: toGhostColor(color, alpha * DISC_ALPHA_RATIOS[1]), stop: DISC_STOPS[1] },
        { value: toGhostColor(color, 0), stop: 100 },
    ];
};

export const spot_flare_3: TrackedGradientConfig = {
    computeSVGDefs: (id, __, getRef, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => {
                    const { getReading } = PointerTracker.create(getRef ?? NO_REF);

                    return SVGGradientDefsUtils.computeRadialGradient({
                        id: `gradient1-${id}`,
                        origin: () => getReading().boxRatio,
                        scale: POOL_SCALE,
                        colors: [
                            { value: `rgb(from ${defs.colors.primary} r g b / 1)` },
                            { value: `rgb(from ${defs.colors.primary} r g b / ${CORE_ALPHA})`, stop: CORE_STOP },
                            { value: `rgb(from ${defs.colors.primary} r g b / ${FALLOFF_ALPHA})`, stop: FALLOFF_STOP },
                            { value: `rgb(from ${defs.colors.primary} r g b / 0)`, stop: 100 },
                        ],
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
        ...GHOSTS.map((ghost, index) => ({
            gradientOrPattern: {
                id: `gradient${index + 2}-${id}`,
                renderDefsElement: () => {
                    const { getReading, getIsPointerPresent } = PointerTracker.create(getRef ?? NO_REF);

                    const getGrowth = () => {
                        const ratio = getReading().boxRatio;
                        const distance = MathUtils.clamp01(Math.hypot(ratio.x - 0.5, ratio.y - 0.5) * 2);

                        return MathUtils.lerp(GHOST_NEAR_GROWTH, GHOST_FAR_GROWTH, distance);
                    };

                    return SVGGradientDefsUtils.computeRadialGradient({
                        id: `gradient${index + 2}-${id}`,
                        origin: () => ({
                            x: getReading().boxRatio.x + (0.5 - getReading().boxRatio.x) * ghost.reach,
                            y: getReading().boxRatio.y + (0.5 - getReading().boxRatio.y) * ghost.reach,
                        }),
                        scale: () => ghost.scale * getGrowth(),
                        colors: () =>
                            computeGhostColors(
                                ghost,
                                defs.colors[ghost.colorKey],
                                SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent()),
                            ),
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
            blend: true,
        })),
    ],
};
