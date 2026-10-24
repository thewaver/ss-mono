import type { Size2d } from "@thewaver/ss-utils";

import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";

export type SlideButtonOrientation = "horizontal" | "vertical";

export type SlideButtonRenderProps = {
    /** Whether the track runs across the page or up it, which is what the painter positions the thumb along. */
    orientation: SlideButtonOrientation;
    /**
     * Which way text runs around the button. On a horizontal track the thumb rests at the right and travels leftward
     * under `"rtl"`, so the painter places it from the right edge; on a vertical track it changes nothing.
     */
    direction: NavigatorDirection;
    /** How far the thumb has been slid, as a share of its travel. */
    progressRatio: number;
    /** Whether the thumb is being dragged right now. */
    isDragging: boolean;
    /** Whether the button is being held down, for the hold-to-confirm route. */
    isHolding: boolean;
};

export type BaseSlideButtonValues = {
    /**
     * What a screen reader says about how to use the button, read after its name: how to confirm it without sliding,
     * such as which key to hold. Nothing else tells somebody who cannot see the thumb that a plain press does nothing,
     * so a button given none warns in the console when it is set up. It is the consumer's own text, in the page's
     * language, and a description from an enclosing form field is read as well.
     */
    ariaDescription?: string;
};

export type SlideButtonCbs = {
    /** Runs once the slide or the hold has been completed. */
    onActivate?: () => void;
    /** Runs when the pointer arrives over the button. */
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the button. */
    onMouseLeave?: (e: MouseEvent) => void;
};

export type SlideButtonMode = "slide" | "hold" | "both";

export type SlideButtonState = {
    /**
     * Whether the track runs across the page or up it. A horizontal button slides from the side the text starts on —
     * left to right, or right to left in a right-to-left page; a vertical one slides upward, from the bottom of the
     * track to the top, whichever way the text runs.
     *
     * The thumb is found and followed along this axis, and the painter receives it among the flags to draw the thumb
     * along the same one. The hold, a held Enter or Space and a click from assistive technology work the same way on
     * both.
     */
    orientation?: SlideButtonOrientation;
    /** How long the thumb is along the track. The track reserves room for it so the far end stays reachable. */
    thumbSize?: number;
    /**
     * How long the button has to be held to confirm without sliding, which is the keyboard and assistive route to the
     * same action. It times a held Enter or Space under every mode, and a held pointer under all but `"slide"`.
     */
    holdDurationMs?: number;
    /**
     * Which pointer gestures reach the action: dragging the thumb along the track, pressing and holding, or both.
     * Defaults to `"both"`, which is the conformant configuration and the one to stay on without a reason to move.
     *
     * **It governs the pointer and nothing else.** A held Enter or Space confirms under every mode, so no setting
     * here can leave the button unoperable from a keyboard, and WCAG 2.1.1 is safe throughout.
     *
     * **`"slide"` requires both halves of the gesture**: the press has to land on the thumb, and it then has to
     * travel far enough to count as a drag rather than a wobble. A press that meets one and not the other does
     * nothing, which is the whole point of the setting — a stray press anywhere on the control is refused.
     *
     * **It also gives up the pointer route that WCAG 2.5.7 Dragging Movements asks for.** That criterion, Level AA,
     * wants anything operable by dragging to also be operable by a single pointer without dragging, and the hold
     * is what answers it — a keyboard route does not, since 2.5.7 is about pointers. The default answers it, so
     * the library ships a working path; a consumer choosing `"slide"` is choosing to give that path up, and it is
     * theirs to replace elsewhere on the page. `"hold"` gives up nothing: it removes the drag, which no criterion
     * requires.
     */
    mode?: SlideButtonMode;
    /**
     * How far along the track the thumb has to be when it is let go for the slide to complete, from `0.1` to `1`; a
     * value outside that range is held to its nearest end. At `1` the thumb has to reach the end of the track, and a
     * smaller value completes the slide part-way along. Letting go short of it puts the thumb back and does nothing.
     *
     * It governs a dragged thumb and nothing else: the hold fills completely before it confirms, and a held Enter or
     * Space and a click from assistive technology confirm at once, under every value.
     */
    completionRatio?: number;
};

export type SlideButtonPress = {
    ratio: number;
    isOnThumb: boolean;
};

export type SlideButtonGestureState = {
    isHolding: boolean;
    isGrabbed: boolean;
};

export type SlideButtonGestureDefs = {
    getMode: () => SlideButtonMode;
    getOrientation: () => SlideButtonOrientation;
    getDirection: () => NavigatorDirection;
    getThumbSize: () => number;
    getHoldDurationMs: () => number;
    getCompletionRatio: () => number;
    getTrackSize: () => Size2d;
    getProgressRatio: () => number;
    setProgressRatio: (ratio: number) => void;
    onActivate: () => void;
};
