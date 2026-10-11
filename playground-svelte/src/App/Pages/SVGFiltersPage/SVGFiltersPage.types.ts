import type {
    SVGDisplacementChannel,
    SVGDropShadowFilterDefs,
    SVGFilterMethod,
    SVGGaussianBlurFilterDefs,
    SVGPixelateFilterDefs,
    SVGTurbulenceFilterDefs,
    SortableItem,
} from "@thewaver/ss-components-svelte";
import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type SVGFiltersExampleProps = {
    method: SVGFilterMethod;
    elementSize: Size2d | undefined;
};

export type SVGFiltersBlurExampleProps = SVGFiltersExampleProps & SVGGaussianBlurFilterDefs;

export type SVGFiltersDropShadowExampleProps = SVGFiltersExampleProps & SVGDropShadowFilterDefs;

export type SVGFiltersTurbulenceExampleProps = SVGFiltersExampleProps & {
    baseFrequency: Point2d;
    scale: number;
    type: NonNullable<SVGTurbulenceFilterDefs["type"]>;
    numOctaves: number;
    seed: number;
    xChannelSelector: SVGDisplacementChannel;
    yChannelSelector: SVGDisplacementChannel;
};

export type SVGFiltersHueExampleProps = SVGFiltersExampleProps & {
    deg: number;
    saturation: number;
    r: number;
    g: number;
    b: number;
};

export type SVGFiltersToneExampleProps = SVGFiltersExampleProps & {
    brightness: number;
    contrast: number;
    inversion: number;
};

export type SVGFiltersPixelateExampleProps = SVGFiltersExampleProps & SVGPixelateFilterDefs;

export type SVGFiltersStackExampleProps = SVGFiltersExampleProps & {
    applied: SortableItem<SVGFiltersStep>[];
    unused: SortableItem<SVGFiltersStep>[];
};
