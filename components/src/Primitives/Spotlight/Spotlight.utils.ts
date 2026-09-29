import type { Rect } from "@thewaver/ss-utils";

import type { SpotlightMode } from "./Spotlight.types";

/** The key every mode answers, which is what keeps even the insistent ones out of a keyboard trap. */
const ESCAPE_KEY = "Escape";

/** Keys that are held rather than pressed for their own sake, which a hint does not take as the reader moving on. */
const MODIFIER_KEYS = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock", "NumLock", "ScrollLock", "AltGraph"]);

/**
 * Cuts a rectangular hole in a covering overlay, and holds the rest of a spotlight that is not about drawing it: which
 * keys dismiss it, how a prompt keeps focus on the one live control, and when a move is announced.
 */
export namespace SpotlightUtils {
    /**
     * The clip path for an overlay with a hole in it.
     *
     * Two rectangles in one path — the whole overlay and the hole — with the even-odd fill rule, which
     * counts the area inside both as outside the shape. That is what leaves a hole rather than an
     * overlapping square, and it is why the outer ring is traced one way and the inner one the other.
     *
     * @param rect The hole, in the overlay's own coordinates.
     * @returns A `polygon()` value for `clip-path`.
     */
    export const getHoleClipPath = (rect: Rect) => {
        const right = rect.x + rect.width;
        const bottom = rect.y + rect.height;
        const outer = "0 0, 0 100%, 100% 100%, 100% 0, 0 0";
        const inner = [
            `${rect.x}px ${rect.y}px`,
            `${right}px ${rect.y}px`,
            `${right}px ${bottom}px`,
            `${rect.x}px ${bottom}px`,
            `${rect.x}px ${rect.y}px`,
        ].join(", ");

        return `polygon(evenodd, ${outer}, ${inner}, 0 0)`;
    };

    /**
     * Whether a key pressed while the spotlight shows dismisses it.
     *
     * Escape always does, in every mode. A hint also takes any other key as the reader having moved on, except a
     * bare modifier, which a screen reader's own commands press on the way to reading the hint.
     *
     * @param key The key, as `KeyboardEvent.key` names it.
     * @param mode The spotlight's mode.
     * @returns Whether to dismiss.
     */
    export const getIsDismissedByKey = (key: string, mode: SpotlightMode) => {
        if (key === ESCAPE_KEY) return true;

        return mode === "hint" && !MODIFIER_KEYS.has(key);
    };

    /**
     * Dismisses the spotlight on the keys {@link getIsDismissedByKey} names, for as long as it listens.
     *
     * @param getMode Reads the mode at the moment a key is pressed.
     * @param onDismiss Called for a key that dismisses.
     * @returns The function that stops listening.
     */
    export const observeDismissKeys = (getMode: () => SpotlightMode, onDismiss: () => void) => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (getIsDismissedByKey(e.key, getMode())) onDismiss();
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    };

    /**
     * Keeps focus on one element, pulling it back whenever it lands anywhere else.
     *
     * It is how a prompt refuses every control but the one it lights: focus is put on the element at once, and any
     * later focus outside it is sent straight back.
     *
     * @param element The element to hold focus on.
     * @returns The function that lets go.
     */
    export const holdFocus = (element: HTMLElement) => {
        const handleFocusIn = (e: FocusEvent) => {
            const target = e.target as Node | null;

            if (target && (element === target || element.contains(target))) return;

            element.focus({ preventScroll: true });
        };

        element.focus({ preventScroll: true });
        document.addEventListener("focusin", handleFocusIn);

        return () => document.removeEventListener("focusin", handleFocusIn);
    };

    /**
     * Whether a new announcement should be spoken.
     *
     * Only a change is, and not the first announcement a spotlight shows with, because a guide's popup takes focus
     * as it opens and the first step is read there already.
     *
     * @param previous The announcement last seen while the spotlight showed, or `undefined` before one was.
     * @param announcement The announcement now.
     * @returns Whether to speak it.
     */
    export const getIsAnnouncementDue = (previous: string | undefined, announcement: string | undefined) =>
        previous !== undefined && announcement !== undefined && announcement !== previous;
}
