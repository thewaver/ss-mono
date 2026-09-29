import { describe, expect, it } from "vitest";

import type { MenuItemRecord as MenuItem } from "./Menu.types";
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

describe("getStaysOpenOnPick", () => {
    it("keeps the menu open for a checkbox and closes it for a command or a radio when the item says nothing", () => {
        expect(MenuUtils.getStaysOpenOnPick(items[0])).toBe(false);
        expect(MenuUtils.getStaysOpenOnPick(items[1])).toBe(true);
        expect(MenuUtils.getStaysOpenOnPick(items[2])).toBe(false);
    });

    it("takes the item's own answer over its kind", () => {
        expect(MenuUtils.getStaysOpenOnPick({ value: "zoom", staysOpenOnPick: true })).toBe(true);
        expect(MenuUtils.getStaysOpenOnPick({ value: "wrap", kind: "checkbox", staysOpenOnPick: false })).toBe(false);
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

const nested: MenuItem<string>[] = [
    { value: "new", items: [{ value: "project" }] },
    { value: "open" },
    { value: "share", items: [{ value: "link" }], isDisabled: true },
    { value: "paste", isDisabled: true, isReachableWhenDisabled: true },
    { value: "delete" },
];

const keyDefs = (overrides?: Partial<Parameters<typeof MenuUtils.computeLevelKeyStep<string>>[1]>) => ({
    entries: nested,
    navigable: MenuUtils.computeNavigableIndexes(nested),
    highlightedIndex: 0,
    hasBackEntry: false,
    isLaidOut: false,
    depth: 0,
    direction: "ltr" as const,
    ...overrides,
});

describe("computeEntries", () => {
    it("puts the opener in front only where a level replaces the one it came from", () => {
        const opener = nested[0];
        const children = opener.items!;

        expect(MenuUtils.computeEntries(children, opener, "replace")).toEqual([opener, ...children]);
        expect(
            MenuUtils.computeEntries(children, opener, "cascade"),
            "a stacked level keeps its parent on screen",
        ).toBe(children);
        expect(
            MenuUtils.computeEntries(nested, undefined, "replace"),
            "and the first level has nothing to go back to",
        ).toBe(nested);
    });
});

describe("computeNavigableIndexes", () => {
    it("skips a disabled item and keeps one that asked to stay reachable", () => {
        expect(MenuUtils.computeNavigableIndexes(nested)).toEqual([0, 1, 3, 4]);
    });
});

describe("computeHighlightedIndex", () => {
    const defs = {
        isOpen: true,
        entries: nested,
        navigable: MenuUtils.computeNavigableIndexes(nested),
        highlightedValue: undefined as string | undefined,
        hasBackEntry: false,
    };

    it("follows the highlighted value while the walk reaches it", () => {
        expect(MenuUtils.computeHighlightedIndex({ ...defs, highlightedValue: "delete" })).toBe(4);
        expect(
            MenuUtils.computeHighlightedIndex({ ...defs, highlightedValue: "share" }),
            "a skipped item falls back",
        ).toBe(0);
    });

    it("starts at the first entry, or the last after the up arrow", () => {
        expect(MenuUtils.computeHighlightedIndex(defs)).toBe(0);
        expect(MenuUtils.computeHighlightedIndex({ ...defs, initialHighlightPosition: "last" })).toBe(4);
    });

    it("starts below the back entry rather than on it", () => {
        const entries = MenuUtils.computeEntries(nested[0].items!, nested[0], "replace");

        expect(
            MenuUtils.computeHighlightedIndex({
                ...defs,
                entries,
                navigable: MenuUtils.computeNavigableIndexes(entries),
                hasBackEntry: true,
            }),
        ).toBe(1);
    });

    it("highlights nothing while closed", () => {
        expect(MenuUtils.computeHighlightedIndex({ ...defs, isOpen: false, highlightedValue: "open" })).toBeUndefined();
    });
});

describe("computeActivation", () => {
    it("steps back from the back entry, opens a branch and picks a leaf", () => {
        const entries = MenuUtils.computeEntries(nested[0].items!, nested[0], "replace");

        expect(MenuUtils.computeActivation(entries, 0, true)).toEqual({ type: "back" });
        expect(MenuUtils.computeActivation(nested, 0, false)).toEqual({ type: "open" });
        expect(MenuUtils.computeActivation(items, 3, false)).toEqual({
            type: "pick",
            item: items[3],
            radioGroupValues: ["small", "medium", "large"],
        });
    });
});

describe("computeLevelKeyStep", () => {
    it("leaves the menu on Tab and activates on Enter and Space", () => {
        expect(MenuUtils.computeLevelKeyStep("Tab", keyDefs())).toEqual({ type: "dismiss" });
        expect(MenuUtils.computeLevelKeyStep("Enter", keyDefs())).toEqual({ type: "activate", index: 0 });
        expect(
            MenuUtils.computeLevelKeyStep(" ", keyDefs({ highlightedIndex: 3 })),
            "a disabled item swallows it",
        ).toEqual({
            type: "claim",
        });
    });

    it("opens a submenu with the arrow along the text, read the way the text runs", () => {
        expect(MenuUtils.computeLevelKeyStep("ArrowRight", keyDefs())).toEqual({ type: "open", index: 0 });
        expect(MenuUtils.computeLevelKeyStep("ArrowLeft", keyDefs({ direction: "rtl" }))).toEqual({
            type: "open",
            index: 0,
        });
        expect(
            MenuUtils.computeLevelKeyStep("ArrowRight", keyDefs({ highlightedIndex: 1 })),
            "a leaf opens nothing",
        ).toBe(undefined);
    });

    it("closes a submenu with the other arrow, and never the first level", () => {
        expect(MenuUtils.computeLevelKeyStep("ArrowLeft", keyDefs({ depth: 1 }))).toEqual({
            type: "close",
            isContained: false,
        });
        expect(MenuUtils.computeLevelKeyStep("ArrowLeft", keyDefs())).toBeUndefined();
    });

    it("walks a laid-out level on every arrow and steps out of a band on Escape, contained", () => {
        expect(MenuUtils.computeLevelKeyStep("ArrowRight", keyDefs({ isLaidOut: true }))).toEqual({
            type: "highlight",
            index: 1,
        });
        expect(MenuUtils.computeLevelKeyStep("Escape", keyDefs({ isLaidOut: true, depth: 1 }))).toEqual({
            type: "close",
            isContained: true,
        });
        expect(
            MenuUtils.computeLevelKeyStep("Escape", keyDefs({ isLaidOut: true })),
            "the first band is dismissed",
        ).toBe(undefined);
    });

    it("walks the reachable entries, wrapping", () => {
        expect(MenuUtils.computeLevelKeyStep("ArrowDown", keyDefs({ highlightedIndex: 1 }))).toEqual({
            type: "highlight",
            index: 3,
        });
        expect(MenuUtils.computeLevelKeyStep("ArrowUp", keyDefs())).toEqual({ type: "highlight", index: 4 });
        expect(MenuUtils.computeLevelKeyStep("End", keyDefs())).toEqual({ type: "highlight", index: 4 });
    });
});

describe("computeTypeaheadIndex", () => {
    it("finds the next reachable entry by its text, and never a skipped one", () => {
        const text = (index: number) => String(nested[index].value);

        expect(MenuUtils.computeTypeaheadIndex("d", [0, 1, 3, 4], 0, text)).toBe(4);
        expect(MenuUtils.computeTypeaheadIndex("s", [0, 1, 3, 4], 0, text)).toBeUndefined();
    });
});

describe("getTriggerOpenPosition", () => {
    it("opens onto the last entry only from the up arrow", () => {
        expect(MenuUtils.getTriggerOpenPosition("ArrowUp")).toBe("last");
        expect(MenuUtils.getTriggerOpenPosition("ArrowDown")).toBe("first");
        expect(MenuUtils.getTriggerOpenPosition("Enter")).toBe("first");
        expect(MenuUtils.getTriggerOpenPosition("ArrowLeft")).toBeUndefined();
    });
});

describe("getIsPointerLed", () => {
    it("tells an enter at the pointer's last point from one somewhere new", () => {
        expect(MenuUtils.getIsPointerLed(undefined, { x: 5, y: 5 })).toBe(true);
        expect(MenuUtils.getIsPointerLed({ x: 5, y: 5 }, { x: 5.5, y: 5 })).toBe(false);
        expect(MenuUtils.getIsPointerLed({ x: 5, y: 5 }, { x: 7, y: 5 })).toBe(true);
    });
});

describe("computeLayoutWidth and computeLayoutShift", () => {
    it("scales a level against the first one", () => {
        expect(MenuUtils.computeLayoutWidth("300px", 200, 100)).toBe("calc(300px * 2)");
        expect(MenuUtils.computeLayoutWidth(undefined, 200, 100)).toBeUndefined();
    });

    it("moves a box whose origin is off its middle so the origin lands on the anchor", () => {
        expect(MenuUtils.computeLayoutShift({ placements: [], heightRatio: 1 })).toBe("translate(0%, 0%)");
        expect(MenuUtils.computeLayoutShift({ placements: [], heightRatio: 1, origin: { x: 0, y: 0.5 } })).toBe(
            "translate(50%, 0%)",
        );
    });
});
