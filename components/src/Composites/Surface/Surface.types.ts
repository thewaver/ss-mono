import type { CSSBorderRadius, CSSBorderWidth, CSSCornerShape } from "@thewaver/ss-utils";

export type BaseSurfaceValues = {
    /** How thick the stroke is on each side. */
    borderWidths: CSSBorderWidth;
    /** How far each corner is rounded. */
    borderRadii: CSSBorderRadius;
    /** How square or how pinched each rounded corner is. */
    lameExponents?: CSSCornerShape;
};

export type BaseSurfaceProps = BaseSurfaceValues;
