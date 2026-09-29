import type { Snippet } from "svelte";
import type { Point2d, Size2d } from "@thewaver/ss-utils";
export type RevealProps = {
    /** How large the window that follows the pointer is. */
    radius?: number;
    /** How far the window's corners are rounded. */
    joinRadii?: number[];
    /** How square or how pinched the window's rounded corners are. */
    lameExponents?: number[];
    /** How gradually the window fades into what is still covered. */
    softness?: number;
    /**
     * How far one press of an arrow key moves the window, in pixels.
     *
     * The reveal is one Tab stop: reaching it from the keyboard opens the window at the center, the arrow keys
     * move it from there, held inside the element, and it closes again when focus leaves. An arrow pressed while
     * the pointer is over the element picks the window up from where the pointer left it, and moving the
     * pointer over it hands the window back.
     */
    stepSize?: number;
    /** Stops the window following the pointer or the keyboard, leaving what is underneath covered. */
    isDisabled?: boolean;
    /**
     * Names the reveal for assistive technology. It is required because the reveal is focusable, and a focusable
     * element with no name is announced as nothing at all.
     */
    ariaLabel: string;
    /** The outline of the window, worked out from the element's size. */
    computePoints?: (size: Size2d) => Point2d[];
    /** Draws what is underneath, waiting to be revealed. */
    renderContent: Snippet;
    /**
     * Draws the covering. It is handed whether the window is open — the pointer inside the element, or the
     * keyboard moving it — and the mask the window cuts into it, as a style to put on the covering element.
     */
    renderCover: Snippet<[isRevealing: boolean, maskStyle: string]>;
};
