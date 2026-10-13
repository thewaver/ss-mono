import type { CSSBorderRadius, CSSBorderWidth, CSSCornerShape } from "@thewaver/ss-utils";

import type { PartialGlassDefs } from "../../Abstracts/Glass/Glass.types";
import type { PointSource } from "../../Abstracts/PointerTracker/PointerTracker.types";

export type BaseGlassSurfaceValues = {
    /** How far each corner is rounded. */
    borderRadii: CSSBorderRadius;
    /** How square or how pinched each rounded corner is. */
    lameExponents?: CSSCornerShape;
    /**
     * How the glass behaves — how far it blurs what is behind it, how it bends it, its grain, its sheen and its tint.
     * Anything left out keeps its default.
     */
    glassDefs?: PartialGlassDefs;
    /**
     * The point the sheen's light follows instead of the pointer.
     *
     * A fraction across a box — the surface's own, or the element named in the source — so one light moving across
     * a page can be handed to every pane under it and each catches it in the same place. While the source has no
     * point the light stays where it last was, as it does when the pointer leaves the window. Left out, the pointer
     * is followed.
     */
    pointSource?: PointSource;
};

export type BaseGlassSurfaceBorderValues = {
    /** How thick the lit edge is on each side. */
    borderWidths: CSSBorderWidth;
};

export type BaseGlassSurfaceProps = BaseGlassSurfaceValues;
