import type { CSSBorderRadius, CSSCornerShape } from "@thewaver/ss-utils";

import type { PartialGlassDefs } from "../../Abstracts/Glass/Glass.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type GlassSurfaceProps = AccessorProps<{
    borderRadii: CSSBorderRadius;
    lameExponents?: CSSCornerShape;
    glassDefs?: PartialGlassDefs;
}>;
