import type { CSSBorderRadius, CSSBorderWidth, CSSCornerShape, Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefs.types";

export type SurfaceProps = {
    /** How thick the outline is on each side. */
    borderWidths: CSSBorderWidth;
    /** How far each corner is rounded. */
    borderRadii: CSSBorderRadius;
    /** How square or how pinched each rounded corner is. */
    lameExponents?: CSSCornerShape;
    /**
     * The paint for the outline, which may build its own SVG definitions. Flat colors are painted by a plain `div`;
     * anything more puts the surface on the SVG path, where it is handed the element's size and the element.
     */
    computeStrokeDefs?: (size: Size2d, element: HTMLElement | undefined) => SVGDefs[];
    /**
     * The paint for the inside, which may build its own SVG definitions. Flat colors are painted by a plain `div`;
     * anything more puts the surface on the SVG path, where it is handed the element's size and the element.
     */
    computeFillDefs?: (size: Size2d, element: HTMLElement | undefined) => SVGDefs[];
};
