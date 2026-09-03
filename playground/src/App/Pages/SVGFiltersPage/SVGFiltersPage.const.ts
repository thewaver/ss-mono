import { SVGFilterDefsFactory } from "@thewaver/ss-components";
import type {
    SVGDropShadowFilterDefs,
    SVGGaussianBlurFilterDefs,
    SVGSaturationFilterDefs,
    SVGTurbulenceFilterDefs,
} from "@thewaver/ss-components";
import type { SortableItem } from "@thewaver/ss-components";

import type { SVGFiltersStep, SVGFiltersStepId } from "./SVGFiltersPage.types";

const BEND: SVGTurbulenceFilterDefs = { baseFrequency: 0.02, scale: 24 };

const BLUR: SVGGaussianBlurFilterDefs = { stdDeviation: 1.5 };

const SHADOW: SVGDropShadowFilterDefs = {
    dx: 6,
    dy: 6,
    stdDeviation: 4,
    floodColor: "#000000",
    floodOpacity: 0.6,
};

const SATURATION: SVGSaturationFilterDefs = { amount: 1.8 };

export const STEP_LIST_GAP = 8;

export const STEP_LIST_MIN_HEIGHT = 72;

const step = (id: SVGFiltersStepId, name: string): SortableItem<SVGFiltersStep> => ({ value: { id, name } });

export const APPLIED_STEPS: SortableItem<SVGFiltersStep>[] = [
    step("turbulence", "Turbulence"),
    step("gaussianBlur", "Blur"),
    step("dropShadow", "Drop shadow"),
    step("saturation", "Saturation"),
];

export const computeStepKey = (value: SVGFiltersStep) => value.id;

export const computeStepLabel = (value: SVGFiltersStep) => value.name;

export const applyStep = (factory: SVGFilterDefsFactory, id: SVGFiltersStepId) => {
    switch (id) {
        case "turbulence":
            return factory.addTurbulenceFilter(BEND);
        case "gaussianBlur":
            return factory.addGaussianBlurFilter(BLUR);
        case "dropShadow":
            return factory.addDropShadowFilter(SHADOW);
        case "saturation":
            return factory.addSaturationFilter(SATURATION);
    }
};
