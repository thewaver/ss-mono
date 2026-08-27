import type { JSX } from "solid-js";

import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../Utils/typeUtils";

export type RevealProps = AccessorProps<{
    radius?: number;
    joinRadii?: number[];
    lameExponents?: number[];
    softness?: number;
    isDisabled?: boolean;
    computePoints?: (size: Size2d) => Point2d[];
    renderContent: () => JSX.Element;
    renderCover: (getIsRevealing: () => boolean, getMaskStyle: () => JSX.CSSProperties) => JSX.Element;
}>;
