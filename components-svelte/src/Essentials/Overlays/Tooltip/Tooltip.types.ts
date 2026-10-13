import type { Snippet } from "svelte";

import type { AnchorPlacement, BaseTooltipProps } from "@thewaver/ss-components";
import type { ShapeArrowAim } from "@thewaver/ss-utils";

export type TooltipProps = BaseTooltipProps & {
    /**
     * The element the tooltip is anchored to and watches. It is also what gets `aria-describedby` while the
     * tooltip is up, which is how the tooltip is announced at all. Handed a different element while it is
     * showing, the tooltip stays up and glides across to it over `transitionDurationMs`, and the description moves
     * with it — which is how one tooltip serves a whole row of controls.
     */
    anchorRef: HTMLElement | undefined;
    /**
     * Draws the tooltip body. The fade is handed in rather than applied, so the consumer decides what fading looks
     * like. The placement it settled on comes with it, and so does where an arrow pointing at the anchor would leave
     * the body: in the body's own pixels, ready for `ShapeUtils.attachArrow`, and `undefined` while the tooltip
     * overlaps its anchor and has nothing to point at.
     */
    renderContent: Snippet<
        [
            visibilityTarget: 0 | 1,
            transitionDurationMs: number,
            placement: AnchorPlacement,
            arrowAim: ShapeArrowAim | undefined,
        ]
    >;
};
