import type { JSX } from "solid-js";

import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../../Utils/typeUtils";

export type RevealProps = AccessorProps<{
    /** How large the window that follows the pointer is. */
    radius?: number;
    /** How far the window's corners are rounded. */
    joinRadii?: number[];
    /** How square or how pinched the window's rounded corners are. */
    lameExponents?: number[];
    /** How gradually the window fades into what is still covered. */
    softness?: number;
    /** Stops the window following the pointer, leaving what is underneath covered. */
    isDisabled?: boolean;
    /** The outline of the window, worked out from the element's size. */
    computePoints?: (size: Size2d) => Point2d[];
    /** Draws what is underneath, waiting to be revealed. */
    renderContent: () => JSX.Element;
    /** Draws the covering. It is handed the mask the window cuts into it. */
    renderCover: (getIsRevealing: () => boolean, getMaskStyle: () => JSX.CSSProperties) => JSX.Element;
}>;
