import type { SegmentedInputCellFlags, SegmentedInputSelection } from "./SegmentedInput.types";

/** The button a press has to be made with to select cells. */
const PRIMARY_BUTTON = 0;

/** How far a point on the horizontal axis lies outside a box, which is zero anywhere inside it. */
const computeDistance = (x: number, rect: Pick<DOMRect, "left" | "right">) =>
    Math.max(rect.left - x, 0, x - rect.right);

/**
 * How a field drawn as a row of cells maps what the reader does onto the one real input underneath.
 *
 * The cells are paint over a single input whose own text, caret and selection are invisible, so everything the
 * reader sees — which cell holds the caret, which are selected — is read from the input and handed to the painter,
 * and a press on a cell is turned into a selection in the input.
 */
export namespace SegmentedInputUtils {
    /**
     * Which cell a point on the horizontal axis falls in, or is nearest to.
     *
     * A point in the gap between two cells, or past either end of the row, belongs to the closest cell, so a press
     * anywhere on the field lands on one. The first of two equally near cells wins.
     *
     * @param x The point, in the same coordinates as the boxes.
     * @param rects Each cell's box, in the order the cells appear in the value.
     * @returns The index of the cell, or `0` when there are no cells.
     */
    export const findCellIndex = (x: number, rects: Pick<DOMRect, "left" | "right">[]) => {
        let found = 0;
        let nearest = Number.POSITIVE_INFINITY;

        rects.forEach((rect, index) => {
            const distance = computeDistance(x, rect);

            if (distance >= nearest) return;

            nearest = distance;
            found = index;
        });

        return found;
    };

    /**
     * The selection that covers a run of cells, in the input's own character positions.
     *
     * Either end may come first, as a drag can go either way. Cells past the end of the value hold no character, so
     * a run starting there becomes a caret after the last character, and a run ending there stops at the last one.
     *
     * @param from The cell the run starts at.
     * @param to The cell the run ends at.
     * @param length How many characters the input holds.
     */
    export const computeCellRange = (from: number, to: number, length: number): SegmentedInputSelection => {
        const low = Math.min(from, to);
        const high = Math.max(from, to);

        if (low >= length) return { start: length, end: length };

        return { start: low, end: Math.min(high + 1, length) };
    };

    /**
     * Where the caret and selection sit in an input.
     *
     * @param element The input.
     * @returns The selection's start and end. An input that reports none reads as a caret after its last character.
     */
    export const readSelection = (element: HTMLInputElement): SegmentedInputSelection => ({
        start: element.selectionStart ?? element.value.length,
        end: element.selectionEnd ?? element.value.length,
    });

    /**
     * What one cell is told about the caret and the selection.
     *
     * The caret belongs to the cell the next character lands in, which is the one at the selection's start, held to
     * the last cell so a full field with the caret at its end still shows it somewhere. Neither is shown while the
     * field does not hold focus.
     *
     * @param index The cell.
     * @param state Whether the field holds focus, where its selection sits, and how many cells it has.
     */
    export const computeCellFlags = (
        index: number,
        state: { isFocused: boolean; selection: SegmentedInputSelection; cellCount: number },
    ): SegmentedInputCellFlags => {
        const { start, end } = state.selection;

        return {
            hasCaret: state.isFocused && index === Math.min(start, state.cellCount - 1),
            isSelected: state.isFocused && start !== end && index >= start && index < end,
        };
    };

    /**
     * Follows the caret and selection of the input under a row of cells, and lets the cells be pressed and dragged.
     *
     * Every way the selection can move — typing, the arrows, a selection by keyboard, focus arriving or leaving — is
     * reported. A key is read again once it has taken effect, since the caret moves only after the key's own event.
     * A press with the primary button on the field selects the cell under it rather than putting the caret wherever
     * the invisible text happens to be, and dragging from there selects every cell it crosses. The press keeps focus
     * in the input. A press on a disabled field does nothing.
     *
     * @param element The input.
     * @param defs.getIsDisabled Whether to ignore presses, read as each press arrives.
     * @param defs.getCells The cells in the order they appear in the value, read as each press or drag arrives.
     * @param defs.onSelectionChange Called with the selection each time it is read.
     * @returns The function that stops listening. It can be called again harmlessly.
     */
    export const observeSelection = (
        element: HTMLInputElement,
        defs: {
            getIsDisabled: () => boolean;
            getCells: () => HTMLElement[];
            onSelectionChange: (selection: SegmentedInputSelection) => void;
        },
    ) => {
        let dragAnchor: number | undefined;

        const report = () => defs.onSelectionChange(readSelection(element));

        const reportLater = () => {
            setTimeout(report);
        };

        const findCell = (x: number) =>
            findCellIndex(
                x,
                defs.getCells().map((cell) => cell.getBoundingClientRect()),
            );

        const selectCells = (from: number, to: number) => {
            const { start, end } = computeCellRange(from, to, element.value.length);

            element.setSelectionRange(start, end);

            report();
        };

        const onPointerDown = (e: PointerEvent) => {
            if (e.button !== PRIMARY_BUTTON || defs.getIsDisabled()) return;

            e.preventDefault();

            dragAnchor = findCell(e.clientX);

            element.focus();
            element.setPointerCapture(e.pointerId);

            selectCells(dragAnchor, dragAnchor);
        };

        const onPointerMove = (e: PointerEvent) => {
            if (dragAnchor === undefined) return;

            selectCells(dragAnchor, findCell(e.clientX));
        };

        const onPointerEnd = () => {
            dragAnchor = undefined;
        };

        const listeners: [string, EventListener][] = [
            ["pointerdown", onPointerDown as EventListener],
            ["pointermove", onPointerMove as EventListener],
            ["pointerup", onPointerEnd],
            ["pointercancel", onPointerEnd],
            ["selectionchange", report],
            ["select", report],
            ["focus", report],
            ["blur", report],
            ["keydown", reportLater],
            ["keyup", report],
        ];

        for (const [type, listener] of listeners) element.addEventListener(type, listener);

        return () => {
            for (const [type, listener] of listeners) element.removeEventListener(type, listener);
        };
    };
}
