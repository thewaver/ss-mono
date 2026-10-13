import type { BaseGlassSurfaceBorderValues, BaseGlassSurfaceProps } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefs.types.js";

export type GlassSurfaceProps = BaseGlassSurfaceProps &
    (
        | (BaseGlassSurfaceBorderValues & {
              /**
               * The paint for the edge, which may build its own SVG definitions. It is handed the element's size and the
               * element itself, which is `undefined` until the glass has mounted.
               */
              computeStrokeDefs: (size: Size2d, element: HTMLElement | undefined) => SVGDefs[];
          })
        | {
              borderWidths?: never;
              computeStrokeDefs?: never;
          }
    );
