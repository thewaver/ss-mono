import type { Accessor, JSX } from "solid-js";

import type { BaseFlipCardCbs, BaseFlipCardValues, FlipCardState } from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type FlipCardProps = AccessorValues<BaseFlipCardValues> &
    BaseFlipCardCbs & {
        /** Which side is showing. It is the only thing that turns the card. */
        flipped: SignalSource<boolean>;
        /** Draws the front. */
        renderFront: (getState: Accessor<FlipCardState>) => JSX.Element;
        /** Draws the back. */
        renderBack: (getState: Accessor<FlipCardState>) => JSX.Element;
    };
