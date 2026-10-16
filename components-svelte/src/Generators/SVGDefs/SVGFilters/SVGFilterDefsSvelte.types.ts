import type {
    SVGColorMixing,
    SVGDiffuseLightingFilterDefs,
    SVGDropShadowFilterDefs,
    SVGFilterAssembly,
    SVGGaussianBlurFilterDefs,
    SVGPixelateFilterDefs,
    SVGRGBSplitFilterDefs,
    SVGSpecularLightingFilterDefs,
    SVGTurbulenceFilterDefs,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import type { SvelteMarkup } from "../../../Utils/typeUtils.js";

export type SVGRGBSplitFilterSvelteDefs = {
    red: () => Point2d;
    green: () => Point2d;
    blue: () => Point2d;
    colorMixing?: () => SVGColorMixing | undefined;
} & Pick<SVGRGBSplitFilterDefs, "maxOffset">;

export type SVGFilterPrimitive = { key: string; custom?: SvelteMarkup } & (
    | { kind: "drop_shadow"; defs: SVGDropShadowFilterDefs }
    | { kind: "gaussian_blur"; defs: SVGGaussianBlurFilterDefs }
    | { kind: "turbulence"; defs: SVGTurbulenceFilterDefs }
    | { kind: "color_matrix"; type: "hueRotate" | "saturate" | "matrix"; values: string }
    | { kind: "pixelate"; defs: SVGPixelateFilterDefs }
    | { kind: "specular_lighting"; defs: SVGSpecularLightingFilterDefs }
    | { kind: "diffuse_lighting"; defs: SVGDiffuseLightingFilterDefs }
    | { kind: "rgb_split"; defs: SVGRGBSplitFilterSvelteDefs }
);

export type SVGFilterElementProps = {
    /** The id the `filter` carries, which an element points at with `filter: url(#…)`. */
    filterId: string;
    /** Which effects to draw in which order, what each is applied to, and how far the region reaches. */
    assembly: SVGFilterAssembly;
    /** Every effect added, by the result name the assembly refers to it by. */
    primitives: Record<string, SVGFilterPrimitive>;
};
