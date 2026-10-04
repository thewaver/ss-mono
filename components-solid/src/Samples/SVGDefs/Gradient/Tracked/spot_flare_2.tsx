import {
    type GradientFlareOpts,
    type SVGDefsColors,
    SVGDefsUtils,
    TrackedGradientDefaults,
} from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

type FlareGhost = {
    reach: number;
    scale: number;
    alpha: number;
    colorKey: keyof SVGDefsColors;
    isRing?: boolean;
};

const GHOSTS: FlareGhost[] = [
    { reach: 0.8, scale: 0.16, alpha: 0.18, colorKey: "secondary" },
    { reach: 1.6, scale: 0.58, alpha: 0.07, colorKey: "secondary", isRing: true },
];

const DISC_STOPS = [45, 78];
const DISC_ALPHA_RATIOS = [1, 0.3];
const RING_STOPS = [55, 82, 92];
const RING_ALPHA_RATIOS = [0.12, 1, 0.2];

const DEFAULTS = TrackedGradientDefaults.SPOT_FLARE_DEFAULTS;

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

export const spot_flare_2 = (opts?: GradientFlareOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const sharedBlur = SVGDefsSolidUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => {
                        const { getReading } = PointerTrackerSolidUtils.create(
                            getRef ?? NO_REF,
                            undefined,
                            defs.getPointSource,
                        );

                        return SVGGradientDefsSolidUtils.computeRadialGradient({
                            id: `gradient1-${id}`,
                            elementSize: (opts?.circular ?? DEFAULTS.circular) ? () => defs.getSize() : undefined,
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
                        const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(
                            getRef ?? NO_REF,
                            undefined,
                            defs.getPointSource,
                        );

                        const getGrowth = () => {
                            const ratio = getReading().boxRatio;
                            const distance = MathUtils.clamp01(Math.hypot(ratio.x - 0.5, ratio.y - 0.5) * 2);

                            return MathUtils.lerp(
                                opts?.ghostNearGrowth ?? DEFAULTS.ghostNearGrowth,
                                opts?.ghostFarGrowth ?? DEFAULTS.ghostFarGrowth,
                                distance,
                            );
                        };

                        return SVGGradientDefsSolidUtils.computeRadialGradient({
                            id: `gradient${index + 2}-${id}`,
                            elementSize: (opts?.circular ?? DEFAULTS.circular) ? () => defs.getSize() : undefined,
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
