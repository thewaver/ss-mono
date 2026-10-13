import { SVGFilterDefsFactory } from "@thewaver/ss-components-svelte";
import { BEND, BLUR, SATURATION, SHADOW } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.const";
import type { SVGFiltersStepId } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";

export const applyStep = (factory: SVGFilterDefsFactory, id: SVGFiltersStepId) => {
    switch (id) {
        case "turbulence":
            return factory.addTurbulenceFilter(BEND);
        case "gaussian_blur":
            return factory.addGaussianBlurFilter(BLUR);
        case "drop_shadow":
            return factory.addDropShadowFilter(SHADOW);
        case "saturation":
            return factory.addSaturationFilter(SATURATION);
    }
};
