import type { BaseGlassSurfaceBorderValues, BaseGlassSurfaceValues } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefsSolid.types";
import type { AccessorValues } from "../../Utils/typeUtils";

export type GlassSurfaceProps = AccessorValues<BaseGlassSurfaceValues> &
    (
        | (AccessorValues<BaseGlassSurfaceBorderValues> & {
              /** The paint for the edge, which may build its own SVG definitions. */
              computeStrokeDefs: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
          })
        | {
              borderWidths?: never;
              computeStrokeDefs?: never;
          }
    );
