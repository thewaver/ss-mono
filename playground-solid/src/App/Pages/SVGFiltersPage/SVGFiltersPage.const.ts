import { SVGFilterDefsFactory } from "@thewaver/ss-components-solid";
import { BEND, BLUR, SATURATION, SHADOW } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.const";
import type { SVGFiltersStepId } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";

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
