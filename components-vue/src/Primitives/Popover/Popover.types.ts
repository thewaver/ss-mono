import type { AriaAttributes, VNodeChild } from "vue";

import type { AnchorPlacement, BasePopoverValues, PopoverCbs } from "@thewaver/ss-components";
import type { ShapeArrowAim } from "@thewaver/ss-utils";

export type PopoverProps = BasePopoverValues &
    PopoverCbs & {
        /** ARIA attributes for the popup element, for the parts of the contract the role alone does not carry. */
        ariaAttributes?: AriaAttributes;
    };

export type PopoverSlots = {
    /**
     * Draws the popup body. The fade is handed in rather than applied, so the consumer decides what fading looks like.
     * The placement it settled on comes with it, and so does where an arrow pointing at the anchor would leave the
     * body: in the body's own pixels, ready for `ShapeUtils.attachArrow`, and `undefined` while the popup overlaps its
     * anchor and has nothing to point at.
     */
    renderContent: (props: {
        visibilityTarget: 0 | 1;
        transitionDurationMs: number;
        placement: AnchorPlacement;
        arrowAim: ShapeArrowAim | undefined;
    }) => VNodeChild;
};
