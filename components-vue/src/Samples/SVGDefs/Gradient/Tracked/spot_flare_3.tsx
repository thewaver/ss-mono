import { defineComponent } from "vue";

import {
    type GradientFlareOpts,
    type SVGDefsColors,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

type FlareGhost = {
    reach: number;
    scale: number;
    alpha: number;
    colorKey: keyof SVGDefsColors;
    isRing?: boolean;
};

type FlarePartProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientFlareOpts;
};

type FlareGhostProps = FlarePartProps & {
    ghost: FlareGhost;
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

const DEFAULTS = TrackedGradientDefaults.SPOT_FLARE_DEFAULTS;

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

const FlareSpot = defineComponent(
    (props: FlarePartProps) => {
        const { reading } = PointerTrackerVueUtils.usePointerReading(() => props.element);

        return () => {
            const color = props.defs.colors.primary;

            return SVGGradientDefsVueUtils.computeRadialGradient({
                id: props.id,
                elementSize: (props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined,
                origin: reading.value.boxRatio,
                scale: props.opts?.glowScale ?? DEFAULTS.glowScale,
                colors: [
                    { value: `rgb(from ${color} r g b / 1)` },
                    {
                        value: `rgb(from ${color} r g b / ${props.opts?.coreAlpha ?? DEFAULTS.coreAlpha})`,
                        stop: props.opts?.coreStop ?? DEFAULTS.coreStop,
                    },
                    {
                        value: `rgb(from ${color} r g b / ${props.opts?.falloffAlpha ?? DEFAULTS.falloffAlpha})`,
                        stop: props.opts?.falloffStop ?? DEFAULTS.falloffStop,
                    },
                    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
                ],
            });
        };
    },
    { name: "FlareSpot", props: declareProps<FlarePartProps>({ id: null, element: null, defs: null, opts: null }) },
);

const FlareGhostGradient = defineComponent(
    (props: FlareGhostProps) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(() => props.element);

        return () => {
            const ratio = reading.value.boxRatio;
            const growth = MathUtils.lerp(
                props.opts?.ghostNearGrowth ?? DEFAULTS.ghostNearGrowth,
                props.opts?.ghostFarGrowth ?? DEFAULTS.ghostFarGrowth,
                MathUtils.clamp01(Math.hypot(ratio.x - 0.5, ratio.y - 0.5) * 2),
            );

            return SVGGradientDefsVueUtils.computeRadialGradient({
                id: props.id,
                elementSize: (props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined,
                origin: {
                    x: ratio.x + (0.5 - ratio.x) * props.ghost.reach,
                    y: ratio.y + (0.5 - ratio.y) * props.ghost.reach,
                },
                scale: props.ghost.scale * growth,
                colors: computeGhostColors(
                    props.ghost,
                    props.defs.colors[props.ghost.colorKey],
                    SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value),
                    props.opts,
                ),
            });
        };
    },
    {
        name: "FlareGhostGradient",
        props: declareProps<FlareGhostProps>({ id: null, element: null, defs: null, opts: null, ghost: null }),
    },
);

export const spot_flare_3 = (opts?: GradientFlareOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => {
        const sharedBlur = SVGDefsVueUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => (
                        <FlareSpot id={`gradient1-${id}`} element={element} defs={defs} opts={opts} />
                    ),
                },
                filter: sharedBlur,
            },
            ...GHOSTS.map((ghost, index) => ({
                gradientOrPattern: {
                    id: `gradient${index + 2}-${id}`,
                    renderDefsElement: () => (
                        <FlareGhostGradient
                            id={`gradient${index + 2}-${id}`}
                            element={element}
                            defs={defs}
                            ghost={ghost}
                            opts={opts}
                        />
                    ),
                },
                filter: sharedBlurRef,
                blend: true,
            })),
        ];
    },
});
