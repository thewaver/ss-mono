import type { PopupTriggerFlags } from "@thewaver/ss-components";

import type { AccessorProps } from "../../Utils/typeUtils";
import type { InteractionControlProps } from "../InteractionWrapper/InteractionWrapperSolid.types";

export type PopupTriggerProps = AccessorProps<
    InteractionControlProps<PopupTriggerFlags> & {
        /**
         * The popup's own element id.
         *
         * It is written as `aria-controls` while the popup is open, which is what tells a screen reader the
         * two belong together — and what lets the dismisser resolve a press inside a portaled popup as a
         * press inside this control's layer rather than outside it.
         */
        popupId: string;
        /** Whether the popup is showing, for `aria-expanded` and for the painter's flags. */
        isOpen: boolean;
    }
> & {
    /** Opens the popup, or closes it when it is already open. Not called while the control is disabled. */
    onToggle: () => void;
};
