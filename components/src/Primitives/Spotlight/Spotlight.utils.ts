import type { Rect } from "@thewaver/ss-utils";

import type { DismisserLayerDefs } from "../../Abstracts/Dismisser/Dismisser.types";
import { DismisserUtils } from "../../Abstracts/Dismisser/Dismisser.utils";
import type { SpotlightMode } from "./Spotlight.types";

/** The key every mode answers, which is what keeps even the insistent ones out of a keyboard trap. */
const ESCAPE_KEY = "Escape";

/** Keys that are held rather than pressed for their own sake, which a hint does not take as the reader moving on. */
const MODIFIER_KEYS = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock", "NumLock", "ScrollLock", "AltGraph"]);

/** The dismissal-stack group every spotlight joins, so only the one opened last acts. */
const SPOTLIGHT_LAYER_GROUP = "spotlight";

const computeUnannouncedWarning = (propName: string) =>
    `SpotlightGuide: a step was shown with no ${propName}. Focus stays in the popup while a step changes, so nothing else tells a screen reader user what the new step is (WCAG 4.1.3) — add one.`;

/**
 * Cuts a rectangular hole in a covering overlay, and holds the rest of a spotlight that is not about drawing it: which
 * keys dismiss it, how it takes its place among other open layers, how a prompt keeps focus on the one live control,
 * and when a move is announced.
 */
export namespace SpotlightUtils {
    /**
     * Warns, in the console, that a guide is showing a step with nothing to announce.
     *
     * Call it while a guide shows. It says nothing when there is an announcement, and an empty one counts as none,
     * since a reader would hear nothing. It reports whether it warned, so a caller warning once per guide can stop
     * asking after the first time.
     *
     * @param announcement What the caller gave for the step showing, if anything.
     * @param propName What the caller's framework calls the prop, so the warning names what they actually wrote.
     * @returns Whether it warned.
     */
    export const warnIfUnannounced = (announcement: string | undefined, propName: string) => {
        if (announcement) return false;

        console.warn(computeUnannouncedWarning(propName));

        return true;
    };

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
     * The spotlight's entry in the dismissal stack, made once per spotlight and registered while it is open.
     *
     * Registered with {@link DismisserUtils.addLayer}, it is how Escape reaches the spotlight: only the topmost
     * layer hears it, so a `Modal` or a popup open above the spotlight takes the key instead, and a spotlight opened
     * above another takes it first. A press or a focus move elsewhere is ignored, since no mode closes on those
     * through the stack. A hint is passive, so a page's shortcuts keep working while one shows; the other modes take
     * the keyboard, as a dialog does. Every spotlight joins one group, so {@link getIsOnTop} can tell which of them
     * was opened last.
     *
     * @param getMode Reads the mode whenever the stack asks.
     * @param onDismiss Called on Escape.
     * @returns The layer. Keep the same object for the spotlight's whole life, since the stack knows it by identity.
     */
    export const createLayer = (getMode: () => SpotlightMode, onDismiss: () => void): DismisserLayerDefs => ({
        group: SPOTLIGHT_LAYER_GROUP,
        get isPassive() {
            return getMode() === "hint";
        },
        getRoots: () => [],
        onDismiss: (reason) => {
            if (reason === "escape") onDismiss();
        },
    });

    /**
     * Whether a spotlight is the one that acts: the open spotlight opened last.
     *
     * Only that one draws its overlay, holds focus, seals the page and lifts the element it lights. One opened while
     * another is open goes on top, and the one beneath waits, still open, until the one above has gone. A layer
     * of any other kind open above it makes no difference here.
     *
     * Read it again whenever {@link DismisserUtils.openLayers} changes.
     *
     * @param layer The spotlight's layer, from {@link createLayer}.
     * @returns `false` while the layer is not registered.
     */
    export const getIsOnTop = (layer: DismisserLayerDefs) =>
        DismisserUtils.getTopLayerInGroup(SPOTLIGHT_LAYER_GROUP) === layer;

    /**
     * Dismisses the spotlight on the keys other than Escape that {@link getIsDismissedByKey} names, for as long as it
     * listens.
     *
     * Escape is the dismissal stack's, through {@link createLayer}. The other keys — a hint's "anything but a bare
     * modifier" — are heard only while no layer that takes input sits above the spotlight, so typing into a dialog
     * opened over a hint does not dismiss the hint.
     *
     * @param layer The spotlight's layer, from {@link createLayer}.
     * @param getMode Reads the mode at the moment a key is pressed.
     * @param onDismiss Called for a key that dismisses.
     * @returns The function that stops listening.
     */
    export const observeDismissKeys = (
        layer: DismisserLayerDefs,
        getMode: () => SpotlightMode,
        onDismiss: () => void,
    ) => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === ESCAPE_KEY || !getIsDismissedByKey(e.key, getMode())) return;
            if (!DismisserUtils.getIsTopForInput(layer)) return;

            onDismiss();
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
