import type { NavigatorCell, NavigatorGrid, NavigatorOrientation } from "./Navigator.types";

/** Lists run vertically unless told otherwise. */
const DEFAULT_NAVIGATION_ORIENTATION: NavigatorOrientation = "column";

/** Which arrow keys move forward, per orientation. */
const NEXT_KEYS: Record<NavigatorOrientation, string[]> = {
    row: ["ArrowRight"],
    column: ["ArrowDown"],
    both: ["ArrowRight", "ArrowDown"],
};

/** Which arrow keys move backward, per orientation. */
const PREVIOUS_KEYS: Record<NavigatorOrientation, string[]> = {
    row: ["ArrowLeft"],
    column: ["ArrowUp"],
    both: ["ArrowLeft", "ArrowUp"],
};

/** Jumps to the start. */
const FIRST_KEY = "Home";
/** Jumps to the end. */
const LAST_KEY = "End";

/**
 * Works out where an arrow key should move focus, in a list or in a grid.
 *
 * Only the arithmetic lives here — no keys are listened for and nothing is focused, so the same
 * rules serve a menu, a tab strip, a calendar and a table. A key the caller has not asked for
 * produces nothing, which is the signal to leave the event alone rather than swallow it.
 */
export namespace NavigatorUtils {
    /**
     * Where a key moves the cursor in a one-dimensional list.
     *
     * The ends wrap round, so pressing down on the last item returns to the first. That is the right
     * behaviour for a menu or a tab strip, which is what this serves.
     *
     * @param key The key that was pressed.
     * @param from Where the cursor is now.
     * @param length How many items there are.
     * @param opts.orientation Which arrows to answer to. `"both"` accepts either pair, for a wrapping
     * grid of items whose rows the caller does not track.
     * @param opts.hasEdgeKeys Pass `false` to leave Home and End alone, for a control where they should
     * still move the text caret.
     * @returns The new position, or `undefined` when the key means nothing here or the list is empty.
     */
    export const computeNextPosition = (
        key: string,
        from: number,
        length: number,
        opts?: { orientation?: NavigatorOrientation; hasEdgeKeys?: boolean },
    ): number | undefined => {
        if (length < 1) return;

        const orientation = opts?.orientation ?? DEFAULT_NAVIGATION_ORIENTATION;

        const step = (delta: number) => (((from + delta) % length) + length) % length;

        if (NEXT_KEYS[orientation].includes(key)) return step(1);
        if (PREVIOUS_KEYS[orientation].includes(key)) return step(-1);

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
     * @param grid How many columns and rows there are.
     * @param opts.pageRows How far Page Up and Page Down jump. The full grid height by default, which
     * in a month grid is one month.
     * @param opts.hasEdgeKeys Pass `false` to leave Home and End alone. They move within the current
     * row, not to the grid's own corners.
     * @param opts.hasPageKeys Pass `false` to leave Page Up and Page Down alone.
     * @returns The new cell, or `undefined` when the key means nothing here or the grid is empty. The
     * `y` can fall outside the grid; the caller decides what that means.
     */
    export const computeNextCell = (
        key: string,
        from: NavigatorCell,
        grid: NavigatorGrid,
        opts?: { pageRows?: number; hasEdgeKeys?: boolean; hasPageKeys?: boolean },
    ): NavigatorCell | undefined => {
        if (grid.width < 1 || grid.height < 1) return;

        const carry = (dx: number, dy: number) => {
            const flat = (from.y + dy) * grid.width + from.x + dx;

            return {
                x: ((flat % grid.width) + grid.width) % grid.width,
                y: Math.floor(flat / grid.width),
            };
        };

        if (key === "ArrowRight") return carry(1, 0);
        if (key === "ArrowLeft") return carry(-1, 0);
        if (key === "ArrowDown") return carry(0, 1);
        if (key === "ArrowUp") return carry(0, -1);

        if (opts?.hasPageKeys !== false) {
            const pageRows = opts?.pageRows ?? grid.height;

            if (key === "PageUp") return { x: from.x, y: from.y - pageRows };
            if (key === "PageDown") return { x: from.x, y: from.y + pageRows };
        }

        if (opts?.hasEdgeKeys === false) return;

        if (key === FIRST_KEY) return { x: 0, y: from.y };
        if (key === LAST_KEY) return { x: grid.width - 1, y: from.y };
    };
}
