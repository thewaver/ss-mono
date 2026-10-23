import { describe, expect, it } from "vitest";

import type { TableColumnDefs as TableColumn } from "./Table.types";
import { TableUtils } from "./Table.utils";

type Person = { name: string; age: number };

const ROWS: Person[] = [
    { name: "Ada", age: 36 },
    { name: "Grace", age: 45 },
    { name: "Alan", age: 41 },
];

const NAME: TableColumn<Person> = {
    id: "name",
    header: "Name",
    compare: (a, b) => a.name.localeCompare(b.name),
};

const UNCOMPARED: TableColumn<Person> = {
    id: "notes",
    header: "Notes",
};

const SIZED: TableColumn<Person> = {
    id: "sized",
    header: "Sized",
    widthPx: 120,
    minWidthPx: 80,
    maxWidthPx: 200,
};

const namesOf = (rows: Person[]) => rows.map((row) => row.name).join(" ");

describe("getSortedOrder", () => {
    it("gives the positions the rows would take, ascending", () => {
        expect(TableUtils.getSortedOrder(ROWS, NAME, { columnId: "name", direction: "ascending" })).toEqual([0, 2, 1]);
    });

    it("gives them reversed when the direction is descending", () => {
        expect(TableUtils.getSortedOrder(ROWS, NAME, { columnId: "name", direction: "descending" })).toEqual([1, 2, 0]);
    });

    it("gives nothing when there is no sort, so the caller keeps the array it already had", () => {
        expect(TableUtils.getSortedOrder(ROWS, NAME, undefined)).toBeUndefined();
    });

    it("gives nothing for a column with no comparator, which is the server-sorted case", () => {
        expect(
            TableUtils.getSortedOrder(ROWS, UNCOMPARED, { columnId: "notes", direction: "ascending" }),
        ).toBeUndefined();
    });

    it("gives nothing when the sort names a different column", () => {
        expect(TableUtils.getSortedOrder(ROWS, NAME, { columnId: "age", direction: "ascending" })).toBeUndefined();
    });

    it("leaves the rows it was handed untouched", () => {
        const before = namesOf(ROWS);

        TableUtils.getSortedOrder(ROWS, NAME, { columnId: "name", direction: "ascending" });

        expect(namesOf(ROWS)).toBe(before);
    });
});

describe("getColumnOrder", () => {
    const COLUMNS = [NAME, { ...NAME, id: "age" }, UNCOMPARED];

    it("gives the declared positions in the order the ids name them", () => {
        expect(TableUtils.getColumnOrder(COLUMNS, ["notes", "name", "age"])).toEqual([2, 0, 1]);
    });

    it("gives nothing when the order is the declared one, so the caller keeps its array", () => {
        expect(TableUtils.getColumnOrder(COLUMNS, ["name", "age", "notes"])).toBeUndefined();
    });

    it("gives nothing when no order was stored at all", () => {
        expect(TableUtils.getColumnOrder(COLUMNS, [])).toBeUndefined();
    });

    it("puts a column the order does not name after the ones it does, in declared order", () => {
        expect(TableUtils.getColumnOrder(COLUMNS, ["notes"])).toEqual([2, 0, 1]);
    });

    it("ignores an id that names no column", () => {
        expect(TableUtils.getColumnOrder(COLUMNS, ["gone", "age"])).toEqual([1, 0, 2]);
    });
});

describe("getReordered", () => {
    it("hands back the very same array when there is no order to apply", () => {
        expect(TableUtils.getReordered(ROWS, undefined)).toBe(ROWS);
    });

    it("reads the entries through the order it was given", () => {
        expect(namesOf(TableUtils.getReordered(ROWS, [1, 2, 0]))).toBe("Grace Alan Ada");
    });
});

describe("getNextSort", () => {
    it("starts an unsorted column at ascending", () => {
        expect(TableUtils.getNextSort(undefined, "name")).toEqual({ columnId: "name", direction: "ascending" });
    });

    it("turns ascending into descending", () => {
        expect(TableUtils.getNextSort({ columnId: "name", direction: "ascending" }, "name")).toEqual({
            columnId: "name",
            direction: "descending",
        });
    });

    it("returns to no sort at all after descending, so the original order is reachable", () => {
        expect(TableUtils.getNextSort({ columnId: "name", direction: "descending" }, "name")).toBeUndefined();
    });

    it("restarts the cycle when a different column is asked for", () => {
        expect(TableUtils.getNextSort({ columnId: "age", direction: "descending" }, "name")).toEqual({
            columnId: "name",
            direction: "ascending",
        });
    });
});

describe("getColumnTrack", () => {
    it("spells a stored width in pixels, which is what a resized column has", () => {
        expect(TableUtils.getColumnTrack(SIZED, { sized: 150 })).toBe("150px");
    });

    it("falls back to the column's own width when nothing is stored", () => {
        expect(TableUtils.getColumnTrack(SIZED, {})).toBe("120px");
    });

    it("gives an unsized column the leftover space, floored at its minimum", () => {
        expect(TableUtils.getColumnTrack({ ...SIZED, widthPx: undefined }, {})).toBe("minmax(80px, 200px)");
    });

    it("stops at a maximum only when one was asked for", () => {
        expect(TableUtils.getColumnTrack({ ...SIZED, widthPx: undefined, maxWidthPx: undefined }, {})).toBe(
            "minmax(80px, 1fr)",
        );
    });
});

describe("getColumnWidth", () => {
    it.each(["constructor", "toString", "__proto__"])(
        "never reads something inherited for a column called %s",
        (id) => {
            const column: TableColumn<Person> = { id, header: id };

            expect(TableUtils.getColumnWidth(column, {})).toBeUndefined();
            expect(TableUtils.getColumnWidth({ ...column, widthPx: 90 }, {})).toBe(90);
            expect(TableUtils.getColumnTrack(column, {})).toBe("minmax(0px, 1fr)");
        },
    );

    it.each(["constructor", "toString", "__proto__"])("still honors a width stored under the id %s", (id) => {
        const column: TableColumn<Person> = { id, header: id, widthPx: 90 };
        const widths: Record<string, number> = {};

        Object.defineProperty(widths, id, { value: 150, enumerable: true });

        expect(TableUtils.getColumnWidth(column, widths)).toBe(150);
        expect(TableUtils.getColumnTrack(column, widths)).toBe("150px");
    });
});

describe("getColumnTemplate", () => {
    it("joins one track per column in the order the columns were given", () => {
        expect(TableUtils.getColumnTemplate([SIZED, NAME], { sized: 90 })).toBe("90px minmax(0px, 1fr)");
    });
});

describe("getResizedWidth", () => {
    it("holds a drag inside the column's own bounds", () => {
        expect(TableUtils.getResizedWidth(SIZED, 40)).toBe(80);
        expect(TableUtils.getResizedWidth(SIZED, 400)).toBe(200);
        expect(TableUtils.getResizedWidth(SIZED, 130)).toBe(130);
    });

    it("treats a column with no bounds as free above zero", () => {
        expect(TableUtils.getResizedWidth(NAME, -20)).toBe(0);
        expect(TableUtils.getResizedWidth(NAME, 900)).toBe(900);
    });
});

describe("TableUtils.computeKeyCommand", () => {
    const GRID = { rowCount: 4, colCount: 3 };
    const OPTS = { direction: "ltr" as const, pageRows: 10 };
    const press = (key: string, mods: Partial<{ ctrlKey: boolean; metaKey: boolean; shiftKey: boolean }> = {}) => ({
        key,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        ...mods,
    });

    it("sorts, resizes and moves from the header row", () => {
        const header = { row: 0, col: 1 };

        expect(TableUtils.computeKeyCommand(press("Enter"), header, GRID, OPTS)).toEqual({ kind: "sort" });
        expect(TableUtils.computeKeyCommand(press("ArrowLeft", { ctrlKey: true }), header, GRID, OPTS)).toEqual({
            kind: "resize",
            step: -1,
        });
        expect(TableUtils.computeKeyCommand(press("ArrowRight", { shiftKey: true }), header, GRID, OPTS)).toEqual({
            kind: "move_column",
            to: 2,
        });
    });

    it("reads left and right in reading order", () => {
        expect(
            TableUtils.computeKeyCommand(press("ArrowRight", { shiftKey: true }), { row: 0, col: 1 }, GRID, {
                ...OPTS,
                direction: "rtl",
            }),
        ).toEqual({ kind: "move_column", to: 0 });
    });

    it("activates and picks from a body row", () => {
        const body = { row: 2, col: 0 };

        expect(TableUtils.computeKeyCommand(press("Enter"), body, GRID, OPTS)).toEqual({
            kind: "activate_row",
            rowIndex: 1,
        });
        expect(TableUtils.computeKeyCommand(press(" ", { shiftKey: true }), body, GRID, OPTS)).toEqual({
            kind: "pick_row",
            rowIndex: 1,
            gesture: { isToggling: false, isExtending: true },
        });
    });

    it("walks inside the grid, extending the selection with Shift into the body", () => {
        const walked = TableUtils.computeKeyCommand(
            press("ArrowDown", { shiftKey: true }),
            { row: 3, col: 0 },
            GRID,
            OPTS,
        );

        expect(walked).toEqual({ kind: "focus", cell: { row: 3, col: 0 }, isExtending: true });
        expect(TableUtils.computeKeyCommand(press("a", { metaKey: true }), { row: 1, col: 0 }, GRID, OPTS)).toEqual({
            kind: "select_all",
        });
        expect(TableUtils.computeKeyCommand(press("x"), { row: 1, col: 0 }, GRID, OPTS)).toBeUndefined();
    });
});

describe("TableUtils.clampCell", () => {
    it("holds a cell inside the grid", () => {
        expect(TableUtils.clampCell({ row: 9, col: -2 }, { rowCount: 4, colCount: 3 })).toEqual({ row: 3, col: 0 });
    });
});

describe("TableUtils.getPinnedOrder", () => {
    const START: TableColumn<Person> = { id: "start", header: "Start", pin: "start", widthPx: 80 };
    const END: TableColumn<Person> = { id: "end", header: "End", pin: "end", widthPx: 60 };

    it("gathers pinned columns at their edges, keeping each kind's own order", () => {
        expect(TableUtils.getPinnedOrder([END, NAME, START, SIZED], undefined)).toEqual([2, 1, 3, 0]);
    });

    it("applies on top of a reader's order", () => {
        expect(TableUtils.getPinnedOrder([START, NAME, SIZED, END], [3, 2, 1, 0])).toEqual([0, 2, 1, 3]);
    });

    it("gives nothing when the result is the declared order, and the order back unchanged with no pin", () => {
        expect(TableUtils.getPinnedOrder([START, NAME, END], undefined)).toBeUndefined();
        expect(TableUtils.getPinnedOrder([NAME, SIZED], [1, 0])).toEqual([1, 0]);
    });
});

describe("TableUtils.computePinOffsets", () => {
    const FIRST: TableColumn<Person> = { id: "first", header: "First", pin: "start", widthPx: 80 };
    const SECOND: TableColumn<Person> = { id: "second", header: "Second", pin: "start", widthPx: 50 };
    const LAST: TableColumn<Person> = { id: "last", header: "Last", pin: "end", widthPx: 60 };
    const BEFORE_LAST: TableColumn<Person> = { id: "beforeLast", header: "Before last", pin: "end", widthPx: 40 };

    it("adds up the widths of the pinned columns between each one and its edge", () => {
        expect(TableUtils.computePinOffsets([FIRST, SECOND, NAME, BEFORE_LAST, LAST], {})).toEqual([
            0,
            80,
            undefined,
            60,
            0,
        ]);
    });

    it("follows a width the reader has set", () => {
        expect(TableUtils.computePinOffsets([FIRST, SECOND], { first: 120 })).toEqual([0, 120]);
    });
});

describe("TableUtils.clampToPinGroup", () => {
    const START: TableColumn<Person> = { id: "start", header: "Start", pin: "start", widthPx: 80 };
    const END: TableColumn<Person> = { id: "end", header: "End", pin: "end", widthPx: 60 };
    const COLUMNS = [START, NAME, SIZED, UNCOMPARED, END];

    it("keeps a scrolling column among the scrolling ones", () => {
        expect(TableUtils.clampToPinGroup(COLUMNS, 2, 0)).toBe(1);
        expect(TableUtils.clampToPinGroup(COLUMNS, 2, 4)).toBe(3);
        expect(TableUtils.clampToPinGroup(COLUMNS, 2, 3)).toBe(3);
    });

    it("keeps a pinned column where it is when it is the only one at its edge", () => {
        expect(TableUtils.clampToPinGroup(COLUMNS, 0, 2)).toBe(0);
        expect(TableUtils.clampToPinGroup(COLUMNS, 4, 1)).toBe(4);
    });
});

describe("TableUtils.computeMinTableWidth", () => {
    it("adds every fixed width and every other column's minimum", () => {
        expect(TableUtils.computeMinTableWidth([SIZED, NAME, { ...UNCOMPARED, minWidthPx: 40 }], {})).toBe(160);
        expect(TableUtils.computeMinTableWidth([SIZED], { sized: 90 })).toBe(90);
    });
});

describe("TableUtils entries", () => {
    const EXPANDED = [1, 3];

    it("lists the open rows by screen position, skipping rows that cannot open", () => {
        expect(TableUtils.getExpandedRows(ROWS, [ROWS[2], ROWS[0]], undefined)).toEqual([0, 2]);
        expect(TableUtils.getExpandedRows(ROWS, [ROWS[2], ROWS[0]], (row) => row.age > 40)).toEqual([2]);
    });

    it("answers with the same empty list whenever nothing is open", () => {
        expect(TableUtils.getExpandedRows(ROWS, [], undefined)).toBe(
            TableUtils.getExpandedRows([], [ROWS[0]], undefined),
        );
    });

    it("opens and closes a row", () => {
        expect(TableUtils.getToggledExpanded([ROWS[0]], ROWS[1])).toEqual([ROWS[0], ROWS[1]]);
        expect(TableUtils.getToggledExpanded([ROWS[0], ROWS[1]], ROWS[0])).toEqual([ROWS[1]]);
    });

    it("counts each open detail as an entry of its own, after its row", () => {
        expect(TableUtils.getEntryCount(5, EXPANDED)).toBe(7);
        expect([0, 1, 2, 3, 4].map((row) => TableUtils.getEntryIndex(row, EXPANDED))).toEqual([0, 1, 3, 4, 6]);
        expect([0, 1, 2, 3, 4, 5, 6].map((entry) => TableUtils.getEntry(entry, EXPANDED))).toEqual([
            { kind: "row", layoutRow: 0 },
            { kind: "row", layoutRow: 1 },
            { kind: "detail", layoutRow: 1 },
            { kind: "row", layoutRow: 2 },
            { kind: "row", layoutRow: 3 },
            { kind: "detail", layoutRow: 3 },
            { kind: "row", layoutRow: 4 },
        ]);
    });

    it("turns a held cell into the walk and back", () => {
        const onDetail = { cell: { row: 4, col: 2 }, isDetail: true };
        const walkCell = TableUtils.computeWalkCell(onDetail, EXPANDED);

        expect(walkCell).toEqual({ row: 6, col: 2 });
        expect(TableUtils.computeFocus(walkCell, EXPANDED)).toEqual(onDetail);
        expect(TableUtils.computeWalkCell({ cell: { row: 0, col: 1 }, isDetail: false }, EXPANDED)).toEqual({
            row: 0,
            col: 1,
        });
    });

    it("hands focus on a closed detail back to its row", () => {
        expect(TableUtils.computeWalkCell({ cell: { row: 3, col: 0 }, isDetail: true }, EXPANDED)).toEqual({
            row: 4,
            col: 0,
        });
    });
});

describe("TableUtils.computeKeyCommand with details", () => {
    const GRID = { rowCount: 5, colCount: 3 };
    const OPTS = {
        direction: "ltr" as const,
        pageRows: 10,
        expandedRows: [0],
        computeIsExpandable: (layoutRow: number) => layoutRow !== 2,
    };
    const press = (key: string, mods: Partial<{ ctrlKey: boolean; metaKey: boolean; shiftKey: boolean }> = {}) => ({
        key,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        ...mods,
    });

    it("opens and closes a row with Enter on its first cell, and activates it from any other", () => {
        expect(TableUtils.computeKeyCommand(press("Enter"), { row: 1, col: 0 }, GRID, OPTS)).toEqual({
            kind: "toggle_row",
            rowIndex: 0,
        });
        expect(TableUtils.computeKeyCommand(press("Enter"), { row: 1, col: 1 }, GRID, OPTS)).toEqual({
            kind: "activate_row",
            rowIndex: 0,
        });
        expect(TableUtils.computeKeyCommand(press("Enter"), { row: 4, col: 0 }, GRID, OPTS)).toEqual({
            kind: "activate_row",
            rowIndex: 2,
        });
    });

    it("names rows by screen position once an open detail sits above them", () => {
        expect(TableUtils.computeKeyCommand(press(" "), { row: 3, col: 1 }, GRID, OPTS)).toEqual({
            kind: "pick_row",
            rowIndex: 1,
            gesture: { isToggling: true, isExtending: false },
        });
    });

    it("walks into an open detail and out of it, leaving the sideways keys alone there", () => {
        expect(TableUtils.computeKeyCommand(press("ArrowDown"), { row: 1, col: 2 }, GRID, OPTS)).toEqual({
            kind: "focus",
            cell: { row: 2, col: 2 },
            isExtending: false,
        });
        expect(TableUtils.computeKeyCommand(press("ArrowDown"), { row: 2, col: 2 }, GRID, OPTS)).toEqual({
            kind: "focus",
            cell: { row: 3, col: 2 },
            isExtending: false,
        });
        expect(TableUtils.computeKeyCommand(press("ArrowRight"), { row: 2, col: 0 }, GRID, OPTS)).toBeUndefined();
        expect(TableUtils.computeKeyCommand(press("Enter"), { row: 2, col: 0 }, GRID, OPTS)).toBeUndefined();
    });

    it("does not extend the selection onto a detail", () => {
        expect(
            TableUtils.computeKeyCommand(press("ArrowDown", { shiftKey: true }), { row: 1, col: 0 }, GRID, OPTS),
        ).toEqual({ kind: "focus", cell: { row: 2, col: 0 }, isExtending: false });
    });
});
