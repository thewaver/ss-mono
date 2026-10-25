import { GestureUtils } from "@thewaver/ss-utils";
import type { SwipeAxis, SwipeDirection } from "@thewaver/ss-utils";

import { FocusManagerUtils } from "../../../Abstracts/FocusManager/FocusManager.utils";
import { LiveAnnouncerUtils } from "../../../Abstracts/LiveAnnouncer/LiveAnnouncer.utils";
import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import type { Shortcut } from "../../../Abstracts/Shortcut/Shortcut.types";
import { ShortcutUtils } from "../../../Abstracts/Shortcut/Shortcut.utils";
import { TOASTS_DEFAULTS } from "./Toasts.const";
import type { ToastsContextType } from "./Toasts.context.types";
import type {
    BaseToast,
    ToastRequest,
    ToastsAlignment,
    ToastsFlexDirection,
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

/** The shortcut that moves focus into the next stack holding toasts. */
const HOTKEY: Shortcut = { key: "F8" };

/** The shortcut that moves focus into the previous stack holding toasts. */
const BACK_HOTKEY: Shortcut = { key: "F8", modifiers: ["shift"] };

/** What a generated toast id starts with, followed by a number. */
const GENERATED_ID_PREFIX = "toast-";

/** One stack in the page-wide register: where it draws, and how to reach it. */
type RegisteredStack = {
    owner: object;
    order: number;
    region: HTMLElement;
    scope: object;
    alignment: ToastsAlignment;
    getHasToasts: () => boolean;
};

/** Every stack on the page, in the order their providers first joined. */
const registeredStacks: RegisteredStack[] = [];

/** When each provider first joined, which keeps its place when it joins again under a new alignment or region. */
const joinOrders = new WeakMap<object, number>();

/** The number the next provider to join is given. */
let nextJoinOrder = 0;

/** Where focus was before the shortcut first moved it into a stack, which Escape inside any stack hands it back to. */
let restoreRef: HTMLElement | undefined;

/** Removes the shortcut's bindings, while at least one stack is registered. */
let unbindHotkeys: (() => void) | undefined;

/** The number the next generated toast id ends with. */
let nextGeneratedIdNumber = 0;

/** The warnings already printed, so each is printed once however often its cause recurs. */
const printedWarnings = new Set<string>();

/** Prints a warning unless it has been printed before. */
const warnOnce = (message: string) => {
    if (printedWarnings.has(message)) return;

    printedWarnings.add(message);
    console.warn(message);
};

/** The warning printed when a second provider draws at an alignment another already draws at. */
const computeSharedAlignmentWarning = (alignment: ToastsAlignment) =>
    `Toasts: two providers draw their stacks at ${alignment} in the same viewport, so their toasts overlap. Give one of them another alignment, or raise both kinds of toast through one provider.`;

/** The warning printed when a toast has nothing to draw it. */
const UNPAINTED_WARNING =
    "Toasts: a toast was queued with no renderToast of its own, under a provider with none either, so it takes its place in the stack and draws nothing. Give the toast a painter, or the provider a default one.";

/** The warning printed when a toast has nothing to be announced with. */
const UNANNOUNCED_WARNING =
    "Toasts: a toast was queued with an empty announcement, so a screen reader user is not told it arrived. Give each toast the sentence it should be announced with.";

/** An id no toast in the queue has yet. */
const computeFreeId = (toasts: BaseToast<unknown>[]) => {
    let id: string;

    do {
        nextGeneratedIdNumber += 1;
        id = `${GENERATED_ID_PREFIX}${nextGeneratedIdNumber}`;
    } while (toasts.some((toast) => toast.id === id));

    return id;
};

/** Whether something is an element that can take focus back. */
const getIsFocusableElement = (target: unknown): target is HTMLElement =>
    typeof HTMLElement !== "undefined" && target instanceof HTMLElement;

/** Hands focus back to where it was before the shortcut moved it into a stack, when Escape is pressed in one. */
const handleStackKeyDown = (e: KeyboardEvent) => {
    if (e.key !== ESCAPE_KEY || !restoreRef) return;

    const target = restoreRef;

    restoreRef = undefined;

    if (!target.isConnected) return;

    e.preventDefault();
    target.focus();
};

/**
 * Turns a toast stack's corner into the flex properties that put it there and the way a toast is swiped off, and
 * holds the rest of a stack that is not about drawing it: which toasts are admitted, the countdown each one runs, the
 * announcements, the direction each toast reads in, and the page-wide register that takes the keyboard from stack to
 * stack.
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
     * @param alignment The corner, as a vertical and a horizontal edge — `"bottom_right"` and the like.
     * @param flexDirection Which way the stack grows.
     * @returns The `justifyContent` and `alignItems` to apply.
     */
    export const computeStackAlignment = (
        alignment: ToastsAlignment,
        flexDirection: ToastsFlexDirection,
    ): ToastsStackAlignment => {
        const [vertical, horizontal] = alignment.split("_") as [ToastsVerticalAlignment, ToastsHorizontalAlignment];
        const isColumn = flexDirection === "column" || flexDirection === "column-reverse";
        const isReversed = flexDirection === "column-reverse" || flexDirection === "row-reverse";

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
     * @param alignment The corner, as a vertical and a horizontal edge — `"bottom_right"` and the like.
     * @returns The direction, or `undefined` for `"middle_center"`.
     */
    export const computeSwipeDirection = (alignment: ToastsAlignment): SwipeDirection | undefined => {
        const [vertical, horizontal] = alignment.split("_") as [ToastsVerticalAlignment, ToastsHorizontalAlignment];

        return SWIPE_DIRECTION_BY_HORIZONTAL[horizontal] ?? SWIPE_DIRECTION_BY_VERTICAL[vertical];
    };

    /**
     * The toasts that are on screen, out of all that are queued.
     *
     * Past the limit, `"dismiss_oldest"` shows the newest ones — the oldest are about to be written out of the
     * queue by {@link computeOverflowTrim} — and `"hold_newest"` shows the oldest, keeping the rest waiting
     * their turn without running a clock.
     *
     * @param toasts Every toast queued, oldest first.
     * @param limit How many may be on screen at once, or `undefined` for no limit.
     * @param overflow What happens past the limit.
     * @returns The admitted toasts, oldest first, or `toasts` itself when all of them fit.
     */
    export const computeAdmitted = <TToast extends BaseToast<unknown>>(
        toasts: TToast[],
        limit: number | undefined,
        overflow: ToastsOverflow,
    ) => {
        if (limit === undefined || toasts.length <= limit) return toasts;

        return overflow === "hold_newest" ? toasts.slice(0, limit) : toasts.slice(toasts.length - limit);
    };

    /**
     * The queue once the toasts past the limit have been dismissed, for `"dismiss_oldest"`.
     *
     * @param toasts Every toast queued, oldest first.
     * @param limit How many may be on screen at once, or `undefined` for no limit.
     * @param overflow What happens past the limit.
     * @returns The newest `limit` toasts, or `undefined` when nothing is to be dismissed — no limit, the list
     * within it, or the overflow held rather than dropped.
     */
    export const computeOverflowTrim = <TToast extends BaseToast<unknown>>(
        toasts: TToast[],
        limit: number | undefined,
        overflow: ToastsOverflow,
    ) => {
        if (limit === undefined || overflow !== "dismiss_oldest" || toasts.length <= limit) return undefined;

        return toasts.slice(toasts.length - limit);
    };

    /**
     * The queue with one more toast at its end.
     *
     * @param toasts Every toast queued.
     * @param toast The toast to add.
     * @returns The longer queue, or `toasts` itself when a toast with the same `id` is already queued, so raising
     * one twice writes nothing.
     */
    export const withToast = <TToast extends BaseToast<unknown>>(toasts: TToast[], toast: TToast) =>
        toasts.some((entry) => entry.id === toast.id) ? toasts : [...toasts, toast];

    /**
     * The queue with a raised toast at its end, and the id it went in under — what a provider's `show` does.
     *
     * A toast raised with no `id` is given one no queued toast has, so raising never needs an id at hand; one raised
     * with an `id` already queued is refused, which is how a consumer keeps one kind of toast from stacking twice.
     *
     * @param toasts Every toast queued.
     * @param request The toast to add, with or without its `id`.
     * @returns `toasts`, the longer queue, and `id`, the toast's id; or `toasts` itself and `id: undefined` when it
     * was refused.
     */
    export const withRequestedToast = <TToast extends BaseToast<unknown>>(
        toasts: TToast[],
        request: ToastRequest<TToast>,
    ): { toasts: TToast[]; id: string | undefined } => {
        const id = request.id ?? computeFreeId(toasts);
        const next = withToast(toasts, { ...request, id } as TToast);

        return next === toasts ? { toasts, id: undefined } : { toasts: next, id };
    };

    /**
     * The queue with one toast taken out.
     *
     * @param toasts Every toast queued.
     * @param id The toast to remove.
     * @returns The queue without it, or `toasts` itself when it was not there, so a second dismissal writes nothing.
     */
    export const withoutToast = <TToast extends BaseToast<unknown>>(toasts: TToast[], id: string) => {
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
    export const computeEntryIds = <TToast extends BaseToast<unknown>>(entryIds: string[], admitted: TToast[]) => {
        const added = admitted.filter((toast) => !entryIds.includes(toast.id)).map((toast) => toast.id);

        return added.length > 0 ? [...entryIds, ...added] : entryIds;
    };

    /**
     * Announces each toast that has just been mounted, at its own urgency.
     *
     * A region carries one politeness for everything in it, so a toast that must interrupt could not be told from one
     * that should wait; each toast's own sentence goes through the announcer instead, polite unless the toast says
     * otherwise. A toast with an empty sentence is not announced, and is warned about once.
     *
     * @param previousIds The ids mounted when this was last called.
     * @param entryIds The ids mounted now.
     * @param admitted What {@link computeAdmitted} answered; a mounted toast that is not in it is leaving and is not
     * announced.
     */
    export const announceArrivals = <TToast extends BaseToast<unknown>>(
        previousIds: string[],
        entryIds: string[],
        admitted: TToast[],
    ) => {
        for (const id of entryIds) {
            if (previousIds.includes(id)) continue;

            const toast = admitted.find((entry) => entry.id === id);

            if (!toast) continue;

            if (!toast.announcement) {
                warnOnce(UNANNOUNCED_WARNING);

                continue;
            }

            LiveAnnouncerUtils.announce(toast.announcement, toast.ariaLive ?? TOASTS_DEFAULTS.ariaLive);
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
     * The axis a toast's swipe runs along.
     *
     * @param swipeDirection What {@link computeSwipeDirection} answered, or `undefined` when the toast cannot be
     * swiped.
     * @returns The direction's axis, or the horizontal one when there is no direction, so the tracker always has one
     * to watch.
     */
    export const computeSwipeAxis = (swipeDirection: SwipeDirection | undefined) =>
        swipeDirection ? GestureUtils.computeSwipeAxis(swipeDirection) : SWIPE_FALLBACK_AXIS;

    /**
     * What raising and dismissing answer outside any provider: nothing is queued, and both report that they did
     * not act.
     */
    export const UNPROVIDED_CONTEXT: ToastsContextType<unknown> = {
        show: () => undefined,
        dismiss: () => false,
    };

    /** The shortcut that moves focus into the next stack holding toasts, from anywhere on the page. */
    export const HOTKEY_FORWARD = HOTKEY;

    /** The shortcut that moves focus into the previous stack holding toasts. */
    export const HOTKEY_BACK = BACK_HOTKEY;

    /**
     * Which stack the shortcut moves focus to next, out of every stack registered.
     *
     * From outside every stack, forward goes to the first stack holding toasts and back to the last. From inside one,
     * it goes to the next or previous stack holding toasts, wrapping round the ends; a stack with nothing in it is
     * passed over. When no other stack holds toasts there is nowhere to go, and focus stays where it is.
     *
     * @param holdsToasts For each stack, in register order, whether it holds toasts.
     * @param currentIndex The stack focus is in, or `-1` when it is in none.
     * @param step `1` for forward, `-1` for back.
     * @returns The stack to focus, or `undefined` when there is nowhere to go.
     */
    export const computeCycleTarget = (holdsToasts: boolean[], currentIndex: number, step: 1 | -1) => {
        const count = holdsToasts.length;

        for (let offset = 1; offset <= count; offset += 1) {
            const index =
                currentIndex < 0
                    ? step > 0
                        ? offset - 1
                        : count - offset
                    : (((currentIndex + step * offset) % count) + count) % count;

            if (index === currentIndex) return undefined;
            if (holdsToasts[index]) return index;
        }

        return undefined;
    };

    /**
     * Moves focus into the next or previous stack holding toasts — what the page-wide shortcut does.
     *
     * Coming from outside every stack, it remembers where focus was, and Escape pressed inside any stack hands it back
     * there, however many stacks the shortcut has passed through since. A consumer may call it from a control of
     * their own, such as a button that takes the reader to their notifications.
     *
     * @param step `1` for forward, `-1` for back.
     * @returns `true` when focus moved, and `false` when there was nowhere to go.
     */
    export const cycleFocus = (step: 1 | -1) => {
        const active = document.activeElement;
        const currentIndex = registeredStacks.findIndex((stack) => stack.region.contains(active));
        const targetIndex = computeCycleTarget(
            registeredStacks.map((stack) => stack.getHasToasts()),
            currentIndex,
            step,
        );

        if (targetIndex === undefined) return false;

        if (currentIndex < 0) restoreRef = getIsFocusableElement(active) ? active : undefined;

        registeredStacks[targetIndex]?.region.focus();

        return true;
    };

    /**
     * Enters a provider's stack in the page-wide register, which keeps every stack in order, holds the one shortcut
     * that reaches them, and warns once when two stacks draw at one alignment in one place.
     *
     * The order is the order providers first joined: a provider joining again — because its alignment, its region or
     * the place it draws into changed — keeps its place, so hand the same `owner` every time. While a stack is
     * registered, Escape pressed in its region hands focus back to where it was before the shortcut first moved it
     * into a stack. The shortcut — {@link HOTKEY_FORWARD} and {@link HOTKEY_BACK} — is bound with the first stack and
     * unbound with the last, on the page itself, so it is quiet while a layer such as a `Modal` sits on top.
     *
     * Two stacks at one alignment in one place overlap, which is allowed but rarely meant. Stacks drawn into
     * different places — the page and a nested viewport, say — never meet, so only a shared place is warned about.
     *
     * @param owner Anything that stays the same for the provider's whole life, which keeps its place in the order.
     * @param defs.region The stack's region, which must be focusable.
     * @param defs.scope Where the stack is drawn: the portal it is mounted into, or the document body without one.
     * @param defs.alignment Where in that place the stack sits.
     * @param defs.getHasToasts Whether the stack holds any toast, read each time the shortcut is pressed.
     * @returns The function that takes the stack out of the register, for when the provider unmounts or any of
     * `defs` changes. Calling it twice is harmless.
     */
    export const registerStack = (
        owner: object,
        defs: { region: HTMLElement; scope: object; alignment: ToastsAlignment; getHasToasts: () => boolean },
    ) => {
        const order = joinOrders.get(owner) ?? nextJoinOrder++;

        joinOrders.set(owner, order);

        if (
            registeredStacks.some(
                (stack) => stack.owner !== owner && stack.scope === defs.scope && stack.alignment === defs.alignment,
            )
        ) {
            warnOnce(computeSharedAlignmentWarning(defs.alignment));
        }

        const entry: RegisteredStack = { owner, order, ...defs };
        const insertAt = registeredStacks.findIndex((stack) => stack.order > order);

        registeredStacks.splice(insertAt < 0 ? registeredStacks.length : insertAt, 0, entry);
        defs.region.addEventListener("keydown", handleStackKeyDown);

        if (!unbindHotkeys) {
            const unbindForward = ShortcutUtils.addBinding({
                shortcut: HOTKEY,
                layer: undefined,
                onTrigger: () => cycleFocus(1),
            });
            const unbindBack = ShortcutUtils.addBinding({
                shortcut: BACK_HOTKEY,
                layer: undefined,
                onTrigger: () => cycleFocus(-1),
            });

            unbindHotkeys = () => {
                unbindForward();
                unbindBack();
            };
        }

        return () => {
            const index = registeredStacks.indexOf(entry);

            if (index < 0) return;

            registeredStacks.splice(index, 1);
            defs.region.removeEventListener("keydown", handleStackKeyDown);

            if (registeredStacks.length > 0) return;

            unbindHotkeys?.();
            unbindHotkeys = undefined;
        };
    };

    /**
     * Which way text runs at whatever raised a toast: the element focused now, or the page with nothing focused.
     *
     * Read when the toast is raised, since that is when the raiser is known; the toast keeps that direction while it
     * shows, as `Modal` reads its opener.
     *
     * @returns `"rtl"` or `"ltr"`.
     */
    export const readRaiserDirection = (): NavigatorDirection =>
        NavigatorUtils.readDirection(FocusManagerUtils.getFocusOrigin());

    /**
     * Which way text runs on the page as a whole, for a toast no raiser was recorded for — one written straight
     * into a queue the consumer holds.
     *
     * @returns `"rtl"` or `"ltr"`.
     */
    export const readPageDirection = (): NavigatorDirection => NavigatorUtils.readDirection(document.documentElement);

    /**
     * Warns, once, that a toast has no painter of its own and its provider has no default to fall back on.
     *
     * @param hasPainter Whether the toast or its provider brought one; nothing is printed when either did.
     */
    export const warnIfUnpainted = (hasPainter: boolean) => {
        if (!hasPainter) warnOnce(UNPAINTED_WARNING);
    };
}
