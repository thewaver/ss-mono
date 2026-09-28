export type SVGFiltersStepId = "turbulence" | "gaussianBlur" | "dropShadow" | "saturation";

export type SVGFiltersStep = {
    id: SVGFiltersStepId;
    name: string;
};
