import type { AccessorProps } from "../../Utils/typeUtils";
import type { InteractionControlProps } from "../InteractionWrapper/InteractionWrapper.types";

export type PopupTriggerFlags = {
    /** Whether the popup this opens is currently showing. */
    isOpen: boolean;
};

export type PopupTriggerProps = AccessorProps<
    InteractionControlProps<PopupTriggerFlags> & {
        /**
         * The popup's own element id.
         *
         * It is written as `aria-controls` while the popup is open, which is what tells a screen reader the
         * two belong together — and what lets the dismisser resolve a press inside a portalled popup as a
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
