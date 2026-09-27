import { GestureUtils } from "@thewaver/ss-utils";
import type { CSSMargin, SwipeAxis, SwipeDirection } from "@thewaver/ss-utils";

import type { DismisserReason } from "../../Abstracts/Dismisser/Dismisser.types";
import type { ModalAlignment } from "./Modal.types";

/** The axis the swipe tracker is given when the dialog has no edge to be swiped towards. It is never engaged there. */
const SWIPE_FALLBACK_AXIS: SwipeAxis = "horizontal";

/** Which way a dialog attached to each edge is pushed to send it away: towards the edge it came from. */
const SWIPE_DIRECTIONS: Partial<Record<ModalAlignment, SwipeDirection>> = {
    left: "left",
    right: "right",
    top: "up",
    bottom: "down",
};

/** A swipe offset is a ratio of the dialog's own size, and a transform takes it as a percentage. */
const PERCENT = 100;

/**
 * The parts of a modal dialog that are not about how it is drawn: which way it is swiped away, how far its box may
 * grow, and which dismissals it honors.
 */
export namespace ModalUtils {
    /** How far across the dialog a swipe must travel, as a fraction of its size, before letting go dismisses it. */
    export const SWIPE_COMMIT_RATIO = 0.35;

    /**
     * The direction that swipes a dialog away.
     *
     * A dialog against an edge — a drawer — is pushed back towards that edge. A centered dialog has no edge to go
     * back to, and cannot be swiped at all.
     *
     * @param alignment Where the dialog sits.
     * @returns The direction, or `undefined` for a centered dialog.
     */
    export const getSwipeDirection = (alignment: ModalAlignment) => SWIPE_DIRECTIONS[alignment];

    /**
     * The axis a dialog's swipe runs along, which is the one the gesture claims from the browser.
     *
     * The other axis is left to the browser to scroll, so a drawer on the left still lets its content pan up and
     * down under a finger. A centered dialog, which is never swiped, answers horizontal so the tracker has an axis
     * to be given.
     *
     * @param alignment Where the dialog sits.
     * @returns The axis.
     */
    export const getSwipeAxis = (alignment: ModalAlignment): SwipeAxis => {
        const direction = getSwipeDirection(alignment);

        return direction ? GestureUtils.computeSwipeAxis(direction) : SWIPE_FALLBACK_AXIS;
    };

    /**
     * Whether a dialog's swipe tracker should be switched off.
     *
     * A centered dialog has no direction to be swiped in. A dialog whose backdrop does not close it cannot be swiped
     * either, because the two are one setting: a swipe is a dragging gesture, and WCAG 2.5.7 needs a single-pointer
     * way to do the same thing, which the backdrop press is. Switching the press off switches the swipe off with it.
     *
     * @param alignment Where the dialog sits.
     * @param isDismissableOnOverlayClick Whether a press on the backdrop closes the dialog.
     * @returns `true` when the swipe should be ignored.
     */
    export const getIsSwipeDisabled = (alignment: ModalAlignment, isDismissableOnOverlayClick: boolean) =>
        getSwipeDirection(alignment) === undefined || !isDismissableOnOverlayClick;

    /**
     * Whether a finished swipe sends the dialog away.
     *
     * Only a swipe committed towards the dialog's own edge does. One that fell short, went the other way, or was
     * taken back by the browser leaves the dialog open, and it springs back to where it was.
     *
     * @param committed The direction the swipe committed to, or `undefined` when it did not commit.
     * @param alignment Where the dialog sits.
     * @returns `true` when the dialog should close.
     */
    export const getIsSwipeDismissal = (committed: SwipeDirection | undefined, alignment: ModalAlignment) =>
        committed !== undefined && committed === getSwipeDirection(alignment);

    /**
     * The transform that follows a swipe in progress, moving the dialog towards its edge by the distance swiped.
     *
     * @param alignment Where the dialog sits.
     * @param offsetRatio How far the dialog has been swiped, as a fraction of its own size, never negative — what
     * `GestureUtils.computeSwipeOffset` answers.
     * @returns A `translateX` or `translateY` in percent, or `undefined` when the dialog is at rest or cannot be
     * swiped, so no transform is written at all.
     */
    export const computeSwipeTransform = (alignment: ModalAlignment, offsetRatio: number) => {
        const direction = getSwipeDirection(alignment);

        if (direction === undefined || offsetRatio === 0) return undefined;

        const distance = offsetRatio * PERCENT * (direction === "left" || direction === "up" ? -1 : 1);

        return getSwipeAxis(alignment) === "horizontal" ? `translateX(${distance}%)` : `translateY(${distance}%)`;
    };

    /**
     * The largest box a dialog may take, given the margins it is held off the screen's edges by.
     *
     * The margins alone would move the dialog in but not stop it growing past the far edge, so the dialog's box is
     * also capped at the room left between them.
     *
     * @param margins The margin on each side, in pixels.
     * @returns `maxWidth` and `maxHeight` as CSS `calc` expressions.
     */
    export const computeMaxSize = (margins: CSSMargin) => ({
        maxWidth: `calc(100% - ${margins.marginLeft + margins.marginRight}px)`,
        maxHeight: `calc(100% - ${margins.marginTop + margins.marginBottom}px)`,
    });

    /**
     * Whether a dismissal the page reports closes the dialog.
     *
     * A modal dialog is not closed by focus leaving or by a press outside its box — the backdrop is the press
     * outside, and it answers for itself. Only Escape is honored here, and only while the dialog allows it.
     *
     * @param reason Why the page asked for a dismissal.
     * @param isDismissableOnEscape Whether Escape closes the dialog.
     * @returns `true` when the dialog should close.
     */
    export const getIsDismissedBy = (reason: DismisserReason, isDismissableOnEscape: boolean) =>
        reason === "escape" && isDismissableOnEscape;
}
