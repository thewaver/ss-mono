import type { JSX } from "solid-js";

import type { BaseModalCbs, BaseModalValues } from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type ModalProps = AccessorValues<BaseModalValues> &
    BaseModalCbs &
    AccessorProps<{
        /** Whether the dialog is open. It is the only thing that opens or closes it. */
        visibility: SignalSource<boolean>;
        /** Draws the backdrop behind the dialog. The fade is handed in rather than applied. */
        renderOverlay: (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => JSX.Element;
        /** Draws the dialog body. The fade is handed in rather than applied. */
        renderContent: (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => JSX.Element;
        /**
         * The element to focus when the dialog opens. Without one the first focusable thing inside it is focused, and
         * failing that the dialog itself, which is what keeps the reader from being dropped behind it.
         */
        initialFocusRef?: HTMLElement;
    }>;
