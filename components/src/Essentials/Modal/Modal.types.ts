import type { JSX } from "solid-js";

import type { CSSMargin } from "@thewaver/ss-utils";

import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type ModalRole = "dialog" | "alertdialog";

export type ModalAlignment = "center" | "left" | "right" | "top" | "bottom";

export type ModalProps = AccessorProps<{
    /** Names the dialog for assistive technology, where the name is not already on screen. */
    ariaLabel?: string;
    /** Points at the element whose text names the dialog, for a dialog that already shows its own title. */
    ariaLabelledBy?: string;
    /** Points at the element whose text describes the dialog, read after its name. */
    ariaDescribedBy?: string;
    /** Whether this is an ordinary dialog or one that interrupts, which decides how insistently it is announced. */
    role?: ModalRole;
    /** Where the dialog sits on the screen. */
    alignment?: ModalAlignment;
    /**
     * Whether clicking the backdrop closes the dialog. Switch it off for a dialog that must be answered rather than
     * dismissed.
     */
    isDismissableOnOverlayClick?: boolean;
    /** Whether the dialog is open. It is the only thing that opens or closes it. */
    visibilitySignal: SignalSource<boolean>;
    /** How long the dialog and its backdrop take to fade in and out. */
    transitionDurationMs?: number;
    /** How far the dialog is held off the edges of the screen. */
    margins?: CSSMargin;
    /** Runs once the dialog is open and has finished arriving. */
    onShow?: () => void;
    /** Runs once the dialog is closed and has finished leaving. */
    onHide?: () => void;
    /**
     * Runs when the fade starts and again when it finishes, for a consumer that has to wait for the dialog to really be
     * gone.
     */
    onTransitionStatusChange?: (hasTransitionFinished: boolean) => void;
    /** Draws the backdrop behind the dialog. The fade is handed in rather than applied. */
    renderOverlay: (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => JSX.Element;
    /** Draws the dialog body. The fade is handed in rather than applied. */
    renderContent: (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => JSX.Element;
}> & {
    /**
     * The element to focus when the dialog opens. Without one the dialog focuses itself, which is what keeps the reader
     * from being dropped behind it.
     */
    initialFocusRef?: MaybeAccessor<HTMLElement | undefined>;
};
