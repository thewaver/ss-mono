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

describe("getSortedRows", () => {
    it("orders by the column's own comparator", () => {
        expect(namesOf(TableUtils.getSortedRows(ROWS, NAME, { columnId: "name", direction: "ascending" }))).toBe(
            "Ada Alan Grace",
        );
    });

    it("reverses that comparator rather than asking for a second one", () => {
        expect(namesOf(TableUtils.getSortedRows(ROWS, NAME, { columnId: "name", direction: "descending" }))).toBe(
            "Grace Alan Ada",
        );
    });

    it("hands back the very same array when nothing is sorted, so no consumer re-renders on a copy", () => {
        expect(TableUtils.getSortedRows(ROWS, NAME, undefined)).toBe(ROWS);
    });

    it("leaves the order alone when the column carries no comparator, which is what defers sorting to the consumer", () => {
        expect(TableUtils.getSortedRows(ROWS, UNCOMPARED, { columnId: "notes", direction: "ascending" })).toBe(ROWS);
    });

    it("leaves the order alone when the sort names a different column", () => {
        expect(TableUtils.getSortedRows(ROWS, NAME, { columnId: "age", direction: "ascending" })).toBe(ROWS);
    });

    it("does not disturb the array it was given", () => {
        TableUtils.getSortedRows(ROWS, NAME, { columnId: "name", direction: "ascending" });

        expect(namesOf(ROWS)).toBe("Ada Grace Alan");
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
