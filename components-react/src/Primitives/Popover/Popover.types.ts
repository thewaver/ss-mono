import type { AriaAttributes, FocusEvent, KeyboardEvent, ReactNode } from "react";

import type { AnchorPlacement, BasePopoverProps } from "@thewaver/ss-components";
import type { ShapeArrowAim } from "@thewaver/ss-utils";

export type PopoverProps = BasePopoverProps & {
    /** ARIA attributes for the popup element, for the parts of the contract the role alone does not carry. */
    ariaAttributes?: AriaAttributes;
    /**
     * Runs on a key pressed inside the popup, for a consumer adding a keyboard contract the role does not already
     * imply.
     */
    onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
    /** Runs when the popup's own element loses focus. */
    onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
    /**
     * Draws the popup body. The fade is handed in rather than applied, so the consumer decides what fading looks like.
     * The placement it settled on comes with it, and so does where an arrow pointing at the anchor would leave the
     * body: in the body's own pixels, ready for `ShapeUtils.attachArrow`, and `undefined` while the popup overlaps its
     * anchor and has nothing to point at.
     */
    renderContent: (
        visibilityTarget: 0 | 1,
        transitionDurationMs: number,
        placement: AnchorPlacement,
        arrowAim: ShapeArrowAim | undefined,
    ) => ReactNode;
};
