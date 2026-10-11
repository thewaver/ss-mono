import type { Signal } from "solid-js";

import type {
    AccessorProps,
    SVGDisplacementChannel,
    SVGDropShadowFilterDefs,
    SVGFilterMethod,
    SVGGaussianBlurFilterDefs,
    SVGPixelateFilterDefs,
    SVGTurbulenceFilterDefs,
    SortableItem,
} from "@thewaver/ss-components-solid";
import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type SVGFiltersExampleProps = AccessorProps<{
    method: SVGFilterMethod;
    elementSize: Size2d | undefined;
}>;

export type SVGFiltersBlurExampleProps = SVGFiltersExampleProps & AccessorProps<SVGGaussianBlurFilterDefs>;

export type SVGFiltersDropShadowExampleProps = SVGFiltersExampleProps & AccessorProps<SVGDropShadowFilterDefs>;

export type SVGFiltersTurbulenceExampleProps = SVGFiltersExampleProps &
    AccessorProps<{
        baseFrequency: Point2d;
        scale: number;
        type: NonNullable<SVGTurbulenceFilterDefs["type"]>;
        numOctaves: number;
        seed: number;
        xChannelSelector: SVGDisplacementChannel;
        yChannelSelector: SVGDisplacementChannel;
    }>;

export type SVGFiltersHueExampleProps = SVGFiltersExampleProps &
    AccessorProps<{
        deg: number;
        saturation: number;
        r: number;
        g: number;
        b: number;
    }>;

export type SVGFiltersToneExampleProps = SVGFiltersExampleProps &
    AccessorProps<{
        brightness: number;
        contrast: number;
        inversion: number;
    }>;

export type SVGFiltersPixelateExampleProps = SVGFiltersExampleProps & AccessorProps<SVGPixelateFilterDefs>;

export type SVGFiltersStackExampleProps = SVGFiltersExampleProps & {
    applied: Signal<SortableItem<SVGFiltersStep>[]>;
    unused: Signal<SortableItem<SVGFiltersStep>[]>;
};
