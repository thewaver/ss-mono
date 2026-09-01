import { describe, expect, it } from "vitest";

import type { TableColumn } from "./Table.types";
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
    renderHeader: () => null,
    renderCell: () => null,
};

const UNCOMPARED: TableColumn<Person> = {
    id: "notes",
    header: "Notes",
    renderHeader: () => null,
    renderCell: () => null,
};

const SIZED: TableColumn<Person> = {
    id: "sized",
    header: "Sized",
    widthPx: 120,
    minWidthPx: 80,
    maxWidthPx: 200,
    renderHeader: () => null,
    renderCell: () => null,
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

describe("getRangeIndices", () => {
    it("spans the two ends inclusively", () => {
        expect(TableUtils.getRangeIndices(2, 5)).toEqual([2, 3, 4, 5]);
    });

    it("reads the same span backwards, since a range has no direction once it is a set of rows", () => {
        expect(TableUtils.getRangeIndices(5, 2)).toEqual([2, 3, 4, 5]);
    });

    it("gives one index when both ends are the same row", () => {
        expect(TableUtils.getRangeIndices(3, 3)).toEqual([3]);
    });
});

describe("getToggledSelection", () => {
    it("adds a row that is not in the selection", () => {
        expect(TableUtils.getToggledSelection([ROWS[0]], ROWS[1])).toEqual([ROWS[0], ROWS[1]]);
    });

    it("removes a row that is", () => {
        expect(TableUtils.getToggledSelection([ROWS[0], ROWS[1]], ROWS[0])).toEqual([ROWS[1]]);
    });
});

describe("getMergedSelection", () => {
    it("keeps what was selected and adds only what is new, so extending never doubles a row", () => {
        expect(TableUtils.getMergedSelection([ROWS[0], ROWS[1]], [ROWS[1], ROWS[2]])).toEqual([
            ROWS[0],
            ROWS[1],
            ROWS[2],
        ]);
    });
});
