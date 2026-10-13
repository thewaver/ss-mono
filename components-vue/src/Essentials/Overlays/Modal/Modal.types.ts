import type { VNodeChild } from "vue";

import type { BaseModalProps } from "@thewaver/ss-components";

export type ModalRenderer = (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;

export type ModalProps = BaseModalProps & {
    /** Whether the dialog is open. It is the only thing that opens or closes it. */
    "visibility": boolean;
    /** Receives `false` when the dialog is dismissed, which is what `v-model:visibility` binds. */
    "onUpdate:visibility"?: (isVisible: boolean) => void;
    /**
     * The element to focus when the dialog opens. Without one the first focusable thing inside it is focused, and
     * failing that the dialog itself, which is what keeps the reader from being dropped behind it.
     */
    "initialFocusRef"?: HTMLElement;
};

export type ModalSlots = {
    /** Draws the backdrop behind the dialog. The fade is handed in rather than applied. */
    renderOverlay: ModalRenderer;
    /** Draws the dialog body. The fade is handed in rather than applied. */
    renderContent: ModalRenderer;
};
