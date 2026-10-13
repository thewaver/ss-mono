import type { ReactNode } from "react";

import type { BaseModalProps } from "@thewaver/ss-components";

export type ModalProps = BaseModalProps & {
    /**
     * Whether the dialog is open, with its setter. It is the only thing that opens or closes it; the dialog writes
     * `false` through the setter when it is dismissed.
     */
    visibility: readonly [boolean, (isVisible: boolean) => void];
    /**
     * The element to focus when the dialog opens. Without one the first focusable thing inside it is focused, and
     * failing that the dialog itself, which is what keeps the reader from being dropped behind it.
     */
    initialFocusRef?: HTMLElement;
    /** Draws the backdrop behind the dialog. The fade is handed in rather than applied. */
    renderOverlay: (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;
    /** Draws the dialog body. The fade is handed in rather than applied. */
    renderContent: (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;
};
