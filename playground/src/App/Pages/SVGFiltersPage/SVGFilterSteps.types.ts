export type SVGFiltersStepId = "turbulence" | "gaussian_blur" | "drop_shadow" | "saturation";

export type SVGFiltersStep = {
    id: SVGFiltersStepId;
    name: string;
};
