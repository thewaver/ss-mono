import { describe, expect, it } from "vitest";

import type { MenuItem } from "./Menu.types";
import { MenuUtils } from "./Menu.utils";

const items: MenuItem<string>[] = [
    { value: "cut" },
    { value: "wrap", kind: "checkbox" },
    { value: "small", kind: "radio" },
    { value: "medium", kind: "radio" },
    { value: "large", kind: "radio" },
    { value: "about" },
];

describe("getKind", () => {
    it("treats a row that says nothing as a command", () => {
        expect(MenuUtils.getKind(items[0])).toBe("command");
        expect(MenuUtils.getIsStateful(items[0])).toBe(false);
    });

    it("reads the two that hold a state", () => {
        expect(MenuUtils.getIsStateful(items[1])).toBe(true);
        expect(MenuUtils.getIsStateful(items[2])).toBe(true);
    });
});

describe("getRadioGroupValues", () => {
    it("gathers the whole run a radio row belongs to, from anywhere inside it", () => {
        expect(MenuUtils.getRadioGroupValues(items, 2)).toEqual(["small", "medium", "large"]);
        expect(MenuUtils.getRadioGroupValues(items, 3)).toEqual(["small", "medium", "large"]);
        expect(MenuUtils.getRadioGroupValues(items, 4)).toEqual(["small", "medium", "large"]);
    });

    it("gathers nothing for a row that is not a radio", () => {
        expect(MenuUtils.getRadioGroupValues(items, 0)).toEqual([]);
        expect(MenuUtils.getRadioGroupValues(items, 1)).toEqual([]);
    });

    it("keeps two runs apart when something sits between them", () => {
        const split: MenuItem<string>[] = [
            { value: "a", kind: "radio" },
            { value: "b", kind: "radio" },
            { value: "gap" },
            { value: "c", kind: "radio" },
        ];

        expect(MenuUtils.getRadioGroupValues(split, 0)).toEqual(["a", "b"]);
        expect(MenuUtils.getRadioGroupValues(split, 3)).toEqual(["c"]);
    });
});

describe("getRuns", () => {
    it("gives every non-radio row a run of its own and gathers the radios", () => {
        expect(MenuUtils.getRuns(items).map((run) => [run.from, run.items.length, run.isRadioGroup])).toEqual([
            [0, 1, false],
            [1, 1, false],
            [2, 3, true],
            [5, 1, false],
        ]);
    });

    it("keeps the flat index each row started at, which is what the ids are built from", () => {
        expect(MenuUtils.getRuns(items).flatMap((run) => run.items.map((_unused, index) => run.from + index))).toEqual([
            0, 1, 2, 3, 4, 5,
        ]);
    });
});
