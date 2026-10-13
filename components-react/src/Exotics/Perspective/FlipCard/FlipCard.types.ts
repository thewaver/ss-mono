import type { ReactNode } from "react";

import type { BaseFlipCardProps, FlipCardState } from "@thewaver/ss-components";

export type FlipCardProps = BaseFlipCardProps & {
    /** Which side is showing. It is the only thing that turns the card. */
    flipped: readonly [boolean, (value: boolean) => void];
    /** Draws the front. */
    renderFront: (state: FlipCardState) => ReactNode;
    /** Draws the back. */
    renderBack: (state: FlipCardState) => ReactNode;
};
