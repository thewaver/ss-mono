import { MathUtils } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { GradientFlareOpts, SVGDefsColors, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { TrackedGradientKnobs } from "../TrackedGradient.knobs";

type FlareGhost = {
    reach: number;
    scale: number;
    alpha: number;
    colorKey: keyof SVGDefsColors;
    isRing?: boolean;
};

const GHOSTS: FlareGhost[] = [
    { reach: 0.36, scale: 0.34, alpha: 0.1, colorKey: "primary" },
    { reach: 0.62, scale: 0.13, alpha: 0.18, colorKey: "primary" },
    { reach: 0.95, scale: 0.52, alpha: 0.08, colorKey: "secondary", isRing: true },
    { reach: 1.18, scale: 0.19, alpha: 0.15, colorKey: "secondary" },
    { reach: 1.44, scale: 0.1, alpha: 0.2, colorKey: "tertiary" },
    { reach: 1.72, scale: 0.66, alpha: 0.07, colorKey: "tertiary", isRing: true },
    { reach: 2, scale: 0.26, alpha: 0.13, colorKey: "tertiary" },
];

const DISC_STOPS = [45, 78];
const DISC_ALPHA_RATIOS = [1, 0.3];
const RING_STOPS = [55, 82, 92];
const RING_ALPHA_RATIOS = [0.12, 1, 0.2];

const DEFAULTS = TrackedGradientKnobs.SPOT_FLARE_DEFAULTS;

const NO_REF = () => undefined;

const toGhostColor = (color: string, alpha: number, opts?: GradientFlareOpts) =>
    `hsl(from ${color} h calc(s * ${opts?.ghostSaturation ?? DEFAULTS.ghostSaturation}) calc(l * ${
        opts?.ghostLuminosity ?? DEFAULTS.ghostLuminosity
    }) / ${alpha})`;

const computeGhostColors = (ghost: FlareGhost, color: string, fade: number, opts?: GradientFlareOpts) => {
    const alpha = ghost.alpha * fade;

    if (ghost.isRing) {
        return [
            { value: toGhostColor(color, 0, opts) },
            { value: toGhostColor(color, alpha * RING_ALPHA_RATIOS[0], opts), stop: RING_STOPS[0] },
            { value: toGhostColor(color, alpha * RING_ALPHA_RATIOS[1], opts), stop: RING_STOPS[1] },
            { value: toGhostColor(color, alpha * RING_ALPHA_RATIOS[2], opts), stop: RING_STOPS[2] },
            { value: toGhostColor(color, 0, opts), stop: 100 },
        ];
    }

    return [
        { value: toGhostColor(color, alpha * DISC_ALPHA_RATIOS[0], opts) },
        { value: toGhostColor(color, alpha * DISC_ALPHA_RATIOS[0], opts), stop: DISC_STOPS[0] },
        { value: toGhostColor(color, alpha * DISC_ALPHA_RATIOS[1], opts), stop: DISC_STOPS[1] },
        { value: toGhostColor(color, 0, opts), stop: 100 },
    ];
};

export const spot_flare_3 = (opts?: GradientFlareOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const sharedBlur = SVGDefsUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => {
                        const { getReading } = PointerTrackerUtils.create(getRef ?? NO_REF);

                        return SVGGradientDefsUtils.computeRadialGradient({
                            id: `gradient1-${id}`,
                            elementSize: opts?.circular ? () => defs.getSize() : undefined,
                            origin: () => getReading().boxRatio,
                            scale: opts?.glowScale ?? DEFAULTS.glowScale,
                            colors: [
                                { value: `rgb(from ${defs.colors.primary} r g b / 1)` },
                                {
                                    value: `rgb(from ${defs.colors.primary} r g b / ${opts?.coreAlpha ?? DEFAULTS.coreAlpha})`,
                                    stop: opts?.coreStop ?? DEFAULTS.coreStop,
                                },
                                {
                                    value: `rgb(from ${defs.colors.primary} r g b / ${opts?.falloffAlpha ?? DEFAULTS.falloffAlpha})`,
                                    stop: opts?.falloffStop ?? DEFAULTS.falloffStop,
                                },
                                { value: `rgb(from ${defs.colors.primary} r g b / 0)`, stop: 100 },
                            ],
                        });
                    },
                },
                filter: sharedBlur,
            },
            ...GHOSTS.map((ghost, index) => ({
                gradientOrPattern: {
                    id: `gradient${index + 2}-${id}`,
                    renderDefsElement: () => {
                        const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(getRef ?? NO_REF);

                        const getGrowth = () => {
                            const ratio = getReading().boxRatio;
                            const distance = MathUtils.clamp01(Math.hypot(ratio.x - 0.5, ratio.y - 0.5) * 2);

                            return MathUtils.lerp(
                                opts?.ghostNearGrowth ?? DEFAULTS.ghostNearGrowth,
                                opts?.ghostFarGrowth ?? DEFAULTS.ghostFarGrowth,
                                distance,
                            );
                        };

                        return SVGGradientDefsUtils.computeRadialGradient({
                            id: `gradient${index + 2}-${id}`,
                            elementSize: opts?.circular ? () => defs.getSize() : undefined,
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
                                    opts,
                                ),
                        });
                    },
                },
                filter: sharedBlurRef,
                blend: true,
            })),
        ];
    },
});
