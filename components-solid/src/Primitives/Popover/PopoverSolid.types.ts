import type { JSX } from "solid-js";

import type { AnchorPlacement, BasePopoverValues, PopoverCbs } from "@thewaver/ss-components";
import type { ShapeArrowAim } from "@thewaver/ss-utils";

import type { AccessorValues, MaybeAccessor } from "../../Utils/typeUtils";

export type PopoverProps = AccessorValues<BasePopoverValues> &
    PopoverCbs & {
        /** ARIA attributes for the popup element, for the parts of the contract the role alone does not carry. */
        ariaAttributes?: MaybeAccessor<JSX.AriaAttributes>;
        /**
         * Draws the popup body. The fade is handed in rather than applied, so the consumer decides what fading looks
         * like. The placement it settled on comes with it, and so does where an arrow pointing at the anchor would
         * leave the body: in the body's own pixels, ready for `ShapeUtils.attachArrow`, and `undefined` while the popup
         * overlaps its anchor and has nothing to point at.
         */
        renderContent: (
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
            getPlacement: () => AnchorPlacement,
            getArrowAim: () => ShapeArrowAim | undefined,
        ) => JSX.Element;
    };
