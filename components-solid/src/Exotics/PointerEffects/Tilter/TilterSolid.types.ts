import type { Accessor, JSX } from "solid-js";

import type { BaseTilterValues, TilterState } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type TilterProps = AccessorValues<BaseTilterValues> & {
    /**
     * Draws the specular layer over the content, and is told where the band should sit.
     *
     * It is a slot rather than something drawn here because the sheen has to take the shape of whatever is
     * underneath it — a card with rounded corners wants a rounded sheen, and a wrapper cannot know the
     * corners its child was given. Left out, the surface turns with nothing on it.
     */
    renderSheen?: (getState: Accessor<TilterState>) => JSX.Element;
};
