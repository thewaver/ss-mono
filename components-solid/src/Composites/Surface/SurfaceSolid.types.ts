import type { BaseSurfaceValues } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefsSolid.types";
import type { AccessorValues } from "../../Utils/typeUtils";

export type SurfaceProps = AccessorValues<BaseSurfaceValues> & {
    /** The paint for the stroke, which may build its own SVG definitions. */
    computeStrokeDefs?: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
    /** The paint for the inside, which may build its own SVG definitions. */
    computeFillDefs?: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
};
