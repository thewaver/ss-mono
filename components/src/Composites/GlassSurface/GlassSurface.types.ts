import type { CSSBorderRadius, CSSBorderWidth, CSSCornerShape, Size2d } from "@thewaver/ss-utils";

import type { PartialGlassDefs } from "../../Abstracts/Glass/Glass.types";
import type { SVGDefs } from "../../Abstracts/SVG/Defs/SVGDefs.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type GlassSurfaceProps = AccessorProps<{
    borderRadii: CSSBorderRadius;
    lameExponents?: CSSCornerShape;
    glassDefs?: PartialGlassDefs;
}> &
    (
        | AccessorProps<{
              borderWidths: CSSBorderWidth;
              computeStrokeDefs: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
          }>
        | {
              borderWidths?: never;
              computeStrokeDefs?: never;
          }
    );
