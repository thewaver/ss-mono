import type { SVGBaseGradientDefs, SVGLinearGradientFields, SVGRadialGradientFields } from "@thewaver/ss-components";

import type { AccessorProps } from "../../../Utils/typeUtils";

export type SVGLinearGradientSolidDefs = SVGBaseGradientDefs & AccessorProps<SVGLinearGradientFields>;

export type SVGRadialGradientSolidDefs = SVGBaseGradientDefs & AccessorProps<SVGRadialGradientFields>;
