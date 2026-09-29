import { GestureUtils } from "@thewaver/ss-utils";
import type { SwipeAxis, SwipeDirection } from "@thewaver/ss-utils";

import { LiveAnnouncerUtils } from "../../Abstracts/LiveAnnouncer/LiveAnnouncer.utils";
import type {
    Toast,
    ToastsAlignment,
    ToastsAriaLive,
    ToastsDir,
    ToastsHorizontalAlignment,
    ToastsOverflow,
    ToastsStackAlignment,
    ToastsVerticalAlignment,
} from "./Toasts.types";

/** Each named edge as its flex equivalent. Both axes are listed, since which one an alignment applies to depends on the stack's direction. */
const EDGE_BY_ALIGNMENT = {
    top: "flex-start",
    middle: "center",
    bottom: "flex-end",
    left: "flex-start",
    center: "center",
    right: "flex-end",
} as const;

/** The way a toast leaves by swiping, for each horizontal edge and then for each vertical one. */
const SWIPE_DIRECTION_BY_HORIZONTAL: Partial<Record<ToastsHorizontalAlignment, SwipeDirection>> = {
    left: "left",
    right: "right",
};

const SWIPE_DIRECTION_BY_VERTICAL: Partial<Record<ToastsVerticalAlignment, SwipeDirection>> = {
    top: "up",
    bottom: "down",
};

/** Each flex edge's mirror, for a reversed stack where the flex direction has already flipped what `flex-start` means. */
const OPPOSITE_EDGE = {
    "flex-start": "flex-end",
    "center": "center",
    "flex-end": "flex-start",
} as const;

/** The key that hands focus back out of the stack. */
const ESCAPE_KEY = "Escape";

/** The axis a toast's swipe tracker watches when the toast cannot be swiped at all, so it still has one. */
const SWIPE_FALLBACK_AXIS: SwipeAxis = "horizontal";

/**
 * Turns a toast stack's corner into the flex properties that put it there and the way a toast is swiped off, and
 * holds the rest of a stack that is not about drawing it: which toasts are admitted, the countdown each one runs, the
 * announcements and the hotkey.
 */
export namespace ToastUtils {
    /** The stack's `z-index`, which puts it over the page it is raised on. */
    export const Z_INDEX = 200;

    /** How far across a toast a swipe must travel, as a fraction of its size, before letting go dismisses it. */
    export const SWIPE_COMMIT_RATIO = 0.35;

    /**
     * The flex alignment for a corner and a stacking direction.
     *
     * Two things have to be resolved together. Which of the two named edges is the main axis depends on
     * whether the stack runs in a column or a row, and a reversed direction has already flipped what
     * `flex-start` means — so it is mirrored back, which is what lets new toasts enter from the top
     * while the stack still sits in the bottom corner.
     *
     * @param alignment The corner, as a vertical and a horizontal edge — `"bottom-right"` and the like.
     * @param dir Which way the stack grows.
     * @returns The `justifyContent` and `alignItems` to apply.
     */
    export const computeStackAlignment = (alignment: ToastsAlignment, dir: ToastsDir): ToastsStackAlignment => {
        const [vertical, horizontal] = alignment.split("-") as [ToastsVerticalAlignment, ToastsHorizontalAlignment];
        const isColumn = dir === "column" || dir === "column-reverse";
        const isReversed = dir === "column-reverse" || dir === "row-reverse";

        const main = EDGE_BY_ALIGNMENT[isColumn ? vertical : horizontal];
        const cross = EDGE_BY_ALIGNMENT[isColumn ? horizontal : vertical];

        return {
            justifyContent: isReversed ? OPPOSITE_EDGE[main] : main,
            alignItems: cross,
        };
    };

    /**
     * Which way a toast is swiped to dismiss it, for the corner or edge its stack sits at.
     *
     * The swipe carries the toast off the nearest edge of the screen. A stack against the left or right
     * edge is swiped sideways, corners included; a stack centered along the top or bottom is swiped up or down; a stack in the middle of the screen has
     * no edge to leave by.
     *
     * @param alignment The corner, as a vertical and a horizontal edge — `"bottom-right"` and the like.
     * @returns The direction, or `undefined` for `"middle-center"`.
     */
    export const computeSwipeDirection = (alignment: ToastsAlignment): SwipeDirection | undefined => {
        const [vertical, horizontal] = alignment.split("-") as [ToastsVerticalAlignment, ToastsHorizontalAlignment];

        return SWIPE_DIRECTION_BY_HORIZONTAL[horizontal] ?? SWIPE_DIRECTION_BY_VERTICAL[vertical];
    };

    /**
     * The toasts that are on screen, out of all the consumer has raised.
     *
     * Past the limit, `"dismiss-oldest"` shows the newest ones — the oldest are about to be written out of the
     * consumer's list by {@link computeOverflowTrim} — and `"hold-newest"` shows the oldest, keeping the rest waiting
     * their turn without running a clock.
     *
     * @param toasts Every toast the consumer holds, oldest first.
     * @param limit How many may be on screen at once, or `undefined` for no limit.
     * @param overflow What happens past the limit.
     * @returns The admitted toasts, oldest first, or `toasts` itself when all of them fit.
     */
    export const computeAdmitted = <T>(toasts: Toast<T>[], limit: number | undefined, overflow: ToastsOverflow) => {
        if (limit === undefined || toasts.length <= limit) return toasts;

        return overflow === "hold-newest" ? toasts.slice(0, limit) : toasts.slice(toasts.length - limit);
    };

    /**
     * The consumer's list once the toasts past the limit have been dismissed, for `"dismiss-oldest"`.
     *
     * @param toasts Every toast the consumer holds, oldest first.
     * @param limit How many may be on screen at once, or `undefined` for no limit.
     * @param overflow What happens past the limit.
     * @returns The newest `limit` toasts, or `undefined` when nothing is to be dismissed — no limit, the list
     * within it, or the overflow held rather than dropped.
     */
    export const computeOverflowTrim = <T>(toasts: Toast<T>[], limit: number | undefined, overflow: ToastsOverflow) => {
        if (limit === undefined || overflow !== "dismiss-oldest" || toasts.length <= limit) return undefined;

        return toasts.slice(toasts.length - limit);
    };

    /**
     * The consumer's list with one toast taken out.
     *
     * @param toasts Every toast the consumer holds.
     * @param id The toast to remove.
     * @returns The list without it, or `toasts` itself when it was not there, so a second dismissal writes nothing.
     */
    export const withoutToast = <T>(toasts: Toast<T>[], id: string) => {
        const next = toasts.filter((toast) => toast.id !== id);

        return next.length === toasts.length ? toasts : next;
    };

    /**
     * The ids of the toasts mounted, once newly admitted ones have joined.
     *
     * A toast that has left the admitted list keeps its place until its exit has played, which is why the mounted
     * ids are their own list rather than the admitted one.
     *
     * @param entryIds The ids mounted now, in the order they arrived.
     * @param admitted What {@link computeAdmitted} answered.
     * @returns The ids with any new arrivals appended, or `entryIds` itself when nothing arrived.
     */
    export const computeEntryIds = <T>(entryIds: string[], admitted: Toast<T>[]) => {
        const added = admitted.filter((toast) => !entryIds.includes(toast.id)).map((toast) => toast.id);

        return added.length > 0 ? [...entryIds, ...added] : entryIds;
    };

    /**
     * Announces each toast that has just been mounted, at its own urgency.
     *
     * The stack's region carries one politeness for everything in it, so a toast that must interrupt could not be
     * told from one that should wait; the announcer is used instead, with the toast's own `ariaLive` winning over
     * the stack's.
     *
     * @param previousIds The ids mounted when this was last called.
     * @param entryIds The ids mounted now.
     * @param admitted What {@link computeAdmitted} answered; a mounted toast that is not in it is leaving and is not
     * announced.
     * @param computeAnnouncement Builds the sentence for one toast.
     * @param politeness The stack's own urgency, for a toast that names none.
     */
    export const announceArrivals = <T>(
        previousIds: string[],
        entryIds: string[],
        admitted: Toast<T>[],
        computeAnnouncement: (toast: Toast<T>) => string,
        politeness: ToastsAriaLive,
    ) => {
        for (const id of entryIds) {
            if (previousIds.includes(id)) continue;

            const toast = admitted.find((entry) => entry.id === id);

            if (!toast) continue;

            LiveAnnouncerUtils.announce(computeAnnouncement(toast), toast.ariaLive ?? politeness);
        }
    };

    /**
     * A toast's countdown, which keeps what is left of it across a pause.
     *
     * A toast held half way through its duration gets the remaining half when it is released, not a fresh full
     * duration; a toast whose duration changes starts again from the new one.
     *
     * @returns `run`, which takes the toast's duration, whether it is held right now and what to call when the time
     * is up. It starts the clock unless the toast is held, and returns the function that stops it and banks the time
     * that elapsed, or nothing when it did not start. Call it again whenever either of the first two changes.
     */
    export const createCountdown = () => {
        let clockDurationMs: number | undefined;
        let remainingMs = 0;

        const run = (durationMs: number, isPaused: boolean, onElapse: () => void) => {
            if (durationMs !== clockDurationMs) {
                clockDurationMs = durationMs;
                remainingMs = durationMs;
            }

            if (isPaused) return undefined;

            const startedAtMs = performance.now();
            const elapseTimeout = setTimeout(onElapse, remainingMs);

            return () => {
                clearTimeout(elapseTimeout);

                remainingMs = Math.max(remainingMs - (performance.now() - startedAtMs), 0);
            };
        };

        return { run };
    };

    /**
     * Gives the stack a keyboard route in and one back out.
     *
     * The hotkey, pressed anywhere outside the stack, moves focus onto it — which nothing could otherwise tab to,
     * since it is portaled to the end of the document. Escape pressed inside hands focus back to where the hotkey
     * found it.
     *
     * @param root The stack's region, which must be focusable.
     * @param hotkey The key, as `KeyboardEvent.key` names it. An empty string listens for nothing.
     * @returns The function that stops listening.
     */
    export const observeHotkey = (root: HTMLElement, hotkey: string) => {
        if (hotkey.length === 0) return () => {};

        let restoreRef: HTMLElement | undefined;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === hotkey) {
                if (root.contains(document.activeElement)) return;

                e.preventDefault();
                restoreRef = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
                root.focus();

                return;
            }

            if (e.key !== ESCAPE_KEY || !root.contains(document.activeElement)) return;

            e.preventDefault();
            restoreRef?.focus();
            restoreRef = undefined;
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    };

    /**
     * The axis a toast's swipe runs along.
     *
     * @param swipeDirection What {@link computeSwipeDirection} answered, or `undefined` when the toast cannot be
     * swiped.
     * @returns The direction's axis, or the horizontal one when there is no direction, so the tracker always has one
     * to watch.
     */
    export const computeSwipeAxis = (swipeDirection: SwipeDirection | undefined) =>
        swipeDirection ? GestureUtils.computeSwipeAxis(swipeDirection) : SWIPE_FALLBACK_AXIS;
}
