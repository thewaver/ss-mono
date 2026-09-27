import type { PartialGlassDefs } from "@thewaver/ss-components";
import type { CSSBorderRadius, CSSBorderWidth, CSSCornerShape, Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefsSolid.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type GlassSurfaceProps = AccessorProps<{
    /** How far each corner is rounded. */
    borderRadii: CSSBorderRadius;
    /** How square or how pinched each rounded corner is. */
    lameExponents?: CSSCornerShape;
    /**
     * How the glass behaves — how far it blurs what is behind it, how it bends it, its grain, its sheen and its tint.
     * Anything left out keeps its default.
     */
    glassDefs?: PartialGlassDefs;
}> &
    (
        | AccessorProps<{
              /** How thick the lit edge is on each side. */
              borderWidths: CSSBorderWidth;
              /** The paint for the edge, which may build its own SVG definitions. */
              computeStrokeDefs: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
          }>
        | {
              borderWidths?: never;
              computeStrokeDefs?: never;
          }
    );
