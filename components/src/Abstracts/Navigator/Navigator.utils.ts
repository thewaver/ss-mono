import { type Index2d, MathUtils, StoreUtils } from "@thewaver/ss-utils";

import type {
    NavigatorDirection,
    NavigatorDirectionWatcher,
    NavigatorGrid,
    NavigatorOrientation,
} from "./Navigator.types";

/** Lists run vertically unless told otherwise. */
const DEFAULT_NAVIGATION_ORIENTATION: NavigatorOrientation = "vertical";

/** Text runs left to right unless something says otherwise. */
const DEFAULT_NAVIGATION_DIRECTION: NavigatorDirection = "ltr";

/** The two horizontal arrows, each paired with the one that means the same thing in the other direction. */
const MIRRORED_KEYS: Record<string, string> = {
    ArrowLeft: "ArrowRight",
    ArrowRight: "ArrowLeft",
};

/** The attribute whose change anywhere in the document can flip a component's direction. */
const DIRECTION_ATTRIBUTE = "dir";

/** Every element being watched, each with the function that re-reads it. */
const directionReaders = new Set<() => void>();

/** The one observer every direction reader shares, while at least one is alive. */
let directionObserver: MutationObserver | undefined;

/** Which way text runs at an element, from its computed style. */
const readDirection = (element: HTMLElement): NavigatorDirection =>
    getComputedStyle(element).direction === "rtl" ? "rtl" : DEFAULT_NAVIGATION_DIRECTION;

/** Adds a reader to the shared observer, starting it for the first; the returned function removes it again. */
const addDirectionReader = (reread: () => void) => {
    directionReaders.add(reread);

    if (directionReaders.size === 1) {
        directionObserver = new MutationObserver(() => {
            for (const reader of [...directionReaders]) reader();
        });
        directionObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [DIRECTION_ATTRIBUTE],
            subtree: true,
        });
    }

    return () => {
        directionReaders.delete(reread);

        if (directionReaders.size > 0) return;

        directionObserver?.disconnect();
        directionObserver = undefined;
    };
};

/** Which arrow keys move forward, per orientation. */
const NEXT_KEYS: Record<NavigatorOrientation, string[]> = {
    horizontal: ["ArrowRight"],
    vertical: ["ArrowDown"],
    both: ["ArrowRight", "ArrowDown"],
};

/** Which arrow keys move backward, per orientation. */
const PREVIOUS_KEYS: Record<NavigatorOrientation, string[]> = {
    horizontal: ["ArrowLeft"],
    vertical: ["ArrowUp"],
    both: ["ArrowLeft", "ArrowUp"],
};

/** Jumps to the start. */
const FIRST_KEY = "Home";
/** Jumps to the end. */
const LAST_KEY = "End";
/** Acts on whatever the cursor is on. */
const ACTIVATION_KEYS = ["Enter", " "];

/**
 * Works out where an arrow key should move focus, in a list or in a grid.
 *
 * Only the arithmetic lives here — no keys are listened for and nothing is focused, so the same
 * rules serve a menu, a tab strip, a calendar and a table. A key the caller has not asked for
 * produces nothing, which is the signal to leave the event alone rather than swallow it.
 */
export namespace NavigatorUtils {
    /**
     * Whether a key means "act on the thing the cursor is on".
     *
     * Enter and Space, which is what every roving widget in the library treats as activation — a day in a
     * calendar, a tile on a board, a node in a bracket, a block on a timeline. It is a predicate rather
     * than an exported list so that a caller cannot hold onto the array and drift from it, and so the two
     * keys are named in one place instead of six.
     *
     * @param key The `key` of the keyboard event.
     */
    export const getIsActivationKey = (key: string) => ACTIVATION_KEYS.includes(key);

    /**
     * The key as it would have been pressed in a left-to-right layout.
     *
     * In a right-to-left layout the left arrow points at what comes next and the right arrow at what came
     * before, so ArrowLeft and ArrowRight trade places; every other key comes back as it was. A control
     * handling its own horizontal keys — opening a submenu, growing a pane, expanding a tree node — reads
     * the key through this and keeps its left-to-right logic unchanged.
     *
     * @param key The `key` of the keyboard event.
     * @param direction The direction the control is laid out in, from {@link NavigatorUtils.createDirectionWatcher}.
     * @returns The key to act on.
     */
    export const computeLogicalKey = (key: string, direction: NavigatorDirection | undefined) =>
        direction === "rtl" ? (MIRRORED_KEYS[key] ?? key) : key;

    /**
     * Keeps track of which way text runs at one element at a time, as the page changes.
     *
     * The watcher is a store: read it with `get`, hear about a change with `subscribe`. It says `"ltr"` until
     * `observe` is handed an element, and again once that element stops being observed. While one is observed
     * the value is the element's computed `direction`, so a `dir` set on the element itself, on any ancestor or
     * through a stylesheet is all seen. It is read when observing starts and again whenever a `dir` attribute
     * changes anywhere in the document; a stylesheet that flips `direction` without any `dir` attribute changing
     * is only picked up at the next such change. One observer serves every watcher on the page and is dropped
     * when the last one stops.
     *
     * Hand `observe` an element that is already in the document: a detached element has no computed direction,
     * and reads as `"ltr"` until the next `dir` change anywhere prompts a re-read.
     *
     * @returns The watcher. `observe(element)` starts reading `element`, stops reading whatever was observed
     * before, and returns the function that stops it again — which does nothing once a later `observe` has
     * taken over.
     */
    export const createDirectionWatcher = (): NavigatorDirectionWatcher => {
        const store = StoreUtils.create<NavigatorDirection>(DEFAULT_NAVIGATION_DIRECTION);

        let stopCurrent: (() => void) | undefined;

        const observe = (element: HTMLElement) => {
            stopCurrent?.();

            const reread = () => store.set(readDirection(element));
            const removeReader = addDirectionReader(reread);

            const stop = () => {
                if (stopCurrent !== stop) return;

                stopCurrent = undefined;
                removeReader();
                store.set(DEFAULT_NAVIGATION_DIRECTION);
            };

            stopCurrent = stop;
            reread();

            return stop;
        };

        return { get: store.get, subscribe: store.subscribe, observe };
    };

    /**
     * Where a key moves the cursor in a one-dimensional list.
     *
     * By default the ends wrap round, so pressing down on the last item returns to the first. That is the
     * right behavior for a menu or a tab strip; a tree, which stops at its ends, passes `isLooping: false`.
     *
     * @param key The key that was pressed.
     * @param from Where the cursor is now.
     * @param length How many items there are.
     * @param opts.orientation Which arrows to answer to. `"both"` accepts either pair, for a wrapping
     * grid of items whose rows the caller does not track.
     * @param opts.direction Which way the items run across the screen. Under `"rtl"` the left arrow
     * moves forward and the right arrow back; the vertical arrows, Home and End are unaffected. Leave it
     * out for items placed at fixed positions rather than laid out in the flow of text.
     * @param opts.hasEdgeKeys Pass `false` to leave Home and End alone, for a control where they should
     * still move the text caret.
     * @param opts.isLooping Pass `false` to stop at the ends: an arrow pressed at the last item forward,
     * or at the first item back, answers the position it was given, so the caller still claims the key
     * and nothing moves. Home and End still reach the ends.
     * @returns The new position, or `undefined` when the key means nothing here or the list is empty.
     */
    export const computeNextPosition = (
        key: string,
        from: number,
        length: number,
        opts?: {
            orientation?: NavigatorOrientation;
            direction?: NavigatorDirection;
            hasEdgeKeys?: boolean;
            isLooping?: boolean;
        },
    ): number | undefined => {
        if (length < 1) return;

        const orientation = opts?.orientation ?? DEFAULT_NAVIGATION_ORIENTATION;
        const logicalKey = computeLogicalKey(key, opts?.direction);

        const step = (delta: number) =>
            opts?.isLooping === false
                ? MathUtils.clamp(from + delta, 0, length - 1)
                : (((from + delta) % length) + length) % length;

        if (NEXT_KEYS[orientation].includes(logicalKey)) return step(1);
        if (PREVIOUS_KEYS[orientation].includes(logicalKey)) return step(-1);

        if (opts?.hasEdgeKeys === false) return;

        if (key === FIRST_KEY) return 0;
        if (key === LAST_KEY) return length - 1;
    };

    /**
     * Where a key moves the cursor in a two-dimensional grid.
     *
     * Horizontal movement carries between rows rather than stopping at the edges: right from the last
     * column lands on the first column of the next row, which is what a calendar wants — the day after
     * Saturday is Sunday. Vertical movement does not wrap, and rows outside the grid are returned as
     * they are, so a calendar can read an out-of-range row as a signal to page to the next month and
     * place the cursor there.
     *
     * @param key The key that was pressed.
     * @param from Where the cursor is now.
     * @param grid How many rows and columns there are.
     * @param opts.pageRows How far Page Up and Page Down jump. The full grid height by default, which
     * in a month grid is one month.
     * @param opts.direction Which way the columns run across the screen. Under `"rtl"` the first column
     * is drawn on the right, so the right arrow moves to the previous column and the left arrow to the
     * next, carrying between rows as usual; rows, Page Up, Page Down, Home and End are unaffected. Leave
     * it out for a grid placed at fixed positions rather than laid out in the flow of text.
     * @param opts.hasEdgeKeys Pass `false` to leave Home and End alone. They move within the current
     * row, not to the grid's own corners.
     * @param opts.hasPageKeys Pass `false` to leave Page Up and Page Down alone.
     * @returns The new cell, or `undefined` when the key means nothing here or the grid is empty. The
     * `row` can fall outside the grid; the caller decides what that means.
     */
    export const computeNextCell = (
        key: string,
        from: Index2d,
        grid: NavigatorGrid,
        opts?: { pageRows?: number; direction?: NavigatorDirection; hasEdgeKeys?: boolean; hasPageKeys?: boolean },
    ): Index2d | undefined => {
        if (grid.colCount < 1 || grid.rowCount < 1) return;

        const logicalKey = computeLogicalKey(key, opts?.direction);

        const carry = (rowDelta: number, colDelta: number) => {
            const flat = (from.row + rowDelta) * grid.colCount + from.col + colDelta;

            return {
                row: Math.floor(flat / grid.colCount),
                col: ((flat % grid.colCount) + grid.colCount) % grid.colCount,
            };
        };

        if (logicalKey === "ArrowRight") return carry(0, 1);
        if (logicalKey === "ArrowLeft") return carry(0, -1);
        if (key === "ArrowDown") return carry(1, 0);
        if (key === "ArrowUp") return carry(-1, 0);

        if (opts?.hasPageKeys !== false) {
            const pageRows = opts?.pageRows ?? grid.rowCount;

            if (key === "PageUp") return { row: from.row - pageRows, col: from.col };
            if (key === "PageDown") return { row: from.row + pageRows, col: from.col };
        }

        if (opts?.hasEdgeKeys === false) return;

        if (key === FIRST_KEY) return { row: from.row, col: 0 };
        if (key === LAST_KEY) return { row: from.row, col: grid.colCount - 1 };
    };
}
