import type { Snippet } from "svelte";

import type { BaseModalProps } from "@thewaver/ss-components";

export type ModalProps = BaseModalProps & {
    /**
     * Whether the dialog is open. Bind it with `bind:visibility`; it is the only thing that opens or closes it, and
     * the dialog writes `false` when it is dismissed.
     */
    visibility: boolean;
    /**
     * The element to focus when the dialog opens. Without one the first focusable thing inside it is focused, and
     * failing that the dialog itself, which is what keeps the reader from being dropped behind it.
     */
    initialFocusRef?: HTMLElement;
    /** Draws the backdrop behind the dialog. The fade is handed in rather than applied. */
    renderOverlay: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;
    /** Draws the dialog body. The fade is handed in rather than applied. */
    renderContent: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;
};
