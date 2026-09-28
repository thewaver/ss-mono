import type {
    SVGDropShadowFilterDefs,
    SVGGaussianBlurFilterDefs,
    SVGSaturationFilterDefs,
    SVGTurbulenceFilterDefs,
    SortableItemRecord,
} from "@thewaver/ss-components";

import type { SVGFiltersStep, SVGFiltersStepId } from "./SVGFilterSteps.types";

export const BEND: SVGTurbulenceFilterDefs = { baseFrequency: 0.02, scale: 24 };

export const BLUR: SVGGaussianBlurFilterDefs = { stdDeviation: 1.5 };

export const SHADOW: SVGDropShadowFilterDefs = {
    dx: 6,
    dy: 6,
    stdDeviation: 4,
    floodColor: "#000000",
    floodOpacity: 0.6,
};

export const SATURATION: SVGSaturationFilterDefs = { amount: 1.8 };

export const STEP_LIST_GAP = 8;

export const STEP_LIST_MIN_HEIGHT = 72;

const step = (id: SVGFiltersStepId, name: string): SortableItemRecord<SVGFiltersStep, never> => ({
    value: { id, name },
});

export const APPLIED_STEPS: SortableItemRecord<SVGFiltersStep, never>[] = [
    step("turbulence", "Turbulence"),
    step("gaussianBlur", "Blur"),
    step("dropShadow", "Drop shadow"),
    step("saturation", "Saturation"),
];

export const computeStepKey = (value: SVGFiltersStep) => value.id;

export const computeStepLabel = (value: SVGFiltersStep) => value.name;
