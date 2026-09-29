import type { PartialGlassDefs } from "@thewaver/ss-components";
import type { CSSBorderRadius, CSSBorderWidth, CSSCornerShape, Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefs.types.js";

export type GlassSurfaceProps = {
    /** How far each corner is rounded. */
    borderRadii: CSSBorderRadius;
    /** How square or how pinched each rounded corner is. */
    lameExponents?: CSSCornerShape;
    /**
     * How the glass behaves — how far it blurs what is behind it, how it bends it, its grain, its sheen and its tint.
     * Anything left out keeps its default.
     */
    glassDefs?: PartialGlassDefs;
} & (
    | {
          /** How thick the lit edge is on each side. */
          borderWidths: CSSBorderWidth;
          /**
           * The paint for the edge, which may build its own SVG definitions. It is handed the element's size and the
           * element itself, which is `undefined` until the glass has mounted.
           */
          computeStrokeDefs: (size: Size2d, element: HTMLElement | undefined) => SVGDefs[];
      }
    | {
          borderWidths?: never;
          computeStrokeDefs?: never;
      }
);
