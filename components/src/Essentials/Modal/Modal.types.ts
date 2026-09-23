import type { JSX } from "solid-js";

import type { CSSMargin } from "@thewaver/ss-utils";

import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type ModalRole = "dialog" | "alertdialog";

export type ModalAlignment = "center" | "left" | "right" | "top" | "bottom";

export type ModalNameProps =
    | AccessorProps<{
          /**
           * Names the dialog for assistive technology, where the name is not already on screen. One of this and
           * `ariaLabelledBy` is required, because a dialog with no name is announced as nothing but a dialog.
           */
          ariaLabel: string;
          ariaLabelledBy?: undefined;
      }>
    | AccessorProps<{
          ariaLabel?: undefined;
          /**
           * Points at the element whose text names the dialog, for a dialog that already shows its own title. One of
           * this and `ariaLabel` is required, because a dialog with no name is announced as nothing but a dialog.
           */
          ariaLabelledBy: string;
      }>;

export type ModalProps = ModalNameProps &
    AccessorProps<{
        /** Points at the element whose text describes the dialog, read after its name. */
        ariaDescribedBy?: string;
        /** Whether this is an ordinary dialog or one that interrupts, which decides how insistently it is announced. */
        role?: ModalRole;
        /** Where the dialog sits on the screen. */
        alignment?: ModalAlignment;
        /**
         * Whether clicking the backdrop closes the dialog. Switch it off for a dialog that must be answered rather than
         * dismissed.
         *
         * On a drawer it also governs swiping the panel away, and the two cannot be separated: a swipe is a dragging
         * gesture, and WCAG 2.5.7 needs a single-pointer way to do what it does. The backdrop tap is the only one the
         * library can promise, so switching it off switches the swipe off too.
         */
        isDismissableOnOverlayClick?: boolean;
        /**
         * Whether Escape closes the dialog. Leave it on unless the dialog must be answered: with this and
         * `isDismissableOnOverlayClick` both off, the dialog has no way out of its own, and the consumer has to paint
         * a control inside it that closes it, or a keyboard user is trapped.
         */
        isDismissableOnEscape?: boolean;
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
         * The element to focus when the dialog opens. Without one the first focusable thing inside it is focused, and
         * failing that the dialog itself, which is what keeps the reader from being dropped behind it.
         */
        initialFocusRef?: MaybeAccessor<HTMLElement | undefined>;
    };
