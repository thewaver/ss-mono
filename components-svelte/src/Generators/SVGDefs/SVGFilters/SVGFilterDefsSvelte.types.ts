import type {
    SVGDiffuseLightingFilterDefs,
    SVGDropShadowFilterDefs,
    SVGFilterAssembly,
    SVGGaussianBlurFilterDefs,
    SVGPixelateFilterDefs,
    SVGSpecularLightingFilterDefs,
    SVGTurbulenceFilterDefs,
} from "@thewaver/ss-components";

import type { SvelteMarkup } from "../../../Utils/typeUtils.js";

export type SVGFilterPrimitive = { key: string; custom?: SvelteMarkup } & (
    | { kind: "dropShadow"; defs: SVGDropShadowFilterDefs }
    | { kind: "gaussianBlur"; defs: SVGGaussianBlurFilterDefs }
    | { kind: "turbulence"; defs: SVGTurbulenceFilterDefs }
    | { kind: "colorMatrix"; type: "hueRotate" | "saturate" | "matrix"; values: string }
    | { kind: "pixelate"; defs: SVGPixelateFilterDefs }
    | { kind: "specularLighting"; defs: SVGSpecularLightingFilterDefs }
    | { kind: "diffuseLighting"; defs: SVGDiffuseLightingFilterDefs }
);

export type SVGFilterElementProps = {
    /** The id the `filter` carries, which an element points at with `filter: url(#…)`. */
    filterId: string;
    /** Which effects to draw in which order, what each is applied to, and how far the region reaches. */
    assembly: SVGFilterAssembly;
    /** Every effect added, by the result name the assembly refers to it by. */
    primitives: Record<string, SVGFilterPrimitive>;
};
