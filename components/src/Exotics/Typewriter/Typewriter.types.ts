import type { AccessorProps } from "../../Utils/typeUtils";

export type TypewriterUpdateCause = "content" | "layout" | "other";

export type TypewriterController = {
    restartAnimation: () => boolean;
    update: (cause: TypewriterUpdateCause) => void;
};

export type TypewriterProps = AccessorProps<{
    /** The animation each character arrives with. */
    animationName?: string;
    /** How long one character takes to arrive. */
    animationDurationMs?: number;
    /** How long each character waits after the one before it, which is what makes the text type rather than appear. */
    animationDelayMs?: number;
    /** How long to wait before the first character arrives. */
    initialAnimationDelayMs?: number;
    /** Starts the typing again when the text is re-laid out, for text that reflows as the window changes. */
    resetAnimationOnLayout?: boolean;
    /** Starts the typing again when the text itself changes. */
    resetAnimationOnContent?: boolean;
    /** Hands the consumer a controller once the text is up, for replaying it from outside. */
    onMount?: (controller: TypewriterController) => void;
    /** Runs once every character has arrived. */
    onAnimationEnd?: () => void;
}>;
