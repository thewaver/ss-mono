import { describe, expect, it } from "vitest";

import { FlattenerUtils } from "../../../Abstracts/Flattener/Flattener.utils";
import type { SelectItemRecord as SelectItem, SelectOptionRecord as SelectOption } from "../Select/Select.types";
import { SelectUtils } from "../Select/Select.utils";
import { ListboxUtils } from "./Listbox.utils";

const OPTIONS: SelectOption<string>[] = [
    { value: "a" },
    { value: "b", isDisabled: true },
    { value: "c", isDisabled: true, isReachableWhenDisabled: true },
    { value: "d" },
];

const ITEMS: SelectItem<string>[] = [
    { value: "a" },
    { label: "First", options: [{ value: "b" }, { value: "c" }] },
    { label: "Second", options: [{ value: "d" }] },
];

const ROWS = FlattenerUtils.getFlatRows(SelectUtils.getItemRows(ITEMS));

const keyEvent = (key: string) => {
    const event = { key, isPrevented: false, ctrlKey: false, metaKey: false, altKey: false } as KeyboardEvent & {
        isPrevented: boolean;
    };

    event.preventDefault = () => {
        event.isPrevented = true;
    };

    return event;
};

describe("getNavigableIndexes", () => {
    it("skips a disabled option and keeps one that is reachable while disabled", () => {
        expect(ListboxUtils.getNavigableIndexes(OPTIONS)).toEqual([0, 2, 3]);
    });
});

describe("computeHighlightedIndex", () => {
    const base = {
        options: OPTIONS,
        navigable: [0, 2, 3],
        highlightedValue: undefined,
        selectedValue: undefined,
        isHighlightExplicit: false,
        isFiltering: false,
    };

    it("follows the value moved to", () => {
        expect(ListboxUtils.computeHighlightedIndex({ ...base, highlightedValue: "d" })).toBe(3);
    });

    it("falls back to the picked option, and then to the first reachable one", () => {
        expect(ListboxUtils.computeHighlightedIndex({ ...base, selectedValue: "c" })).toBe(2);
        expect(ListboxUtils.computeHighlightedIndex(base)).toBe(0);
    });

    it("prefers the first option over the picked one while filtering", () => {
        expect(ListboxUtils.computeHighlightedIndex({ ...base, selectedValue: "d", isFiltering: true })).toBe(0);
    });

    it("does not fall back to an option it cannot reach", () => {
        expect(ListboxUtils.computeHighlightedIndex({ ...base, highlightedValue: "b" })).toBe(0);
    });

    it("has no fallback when the highlight is explicit", () => {
        expect(
            ListboxUtils.computeHighlightedIndex({ ...base, selectedValue: "d", isHighlightExplicit: true }),
        ).toBeUndefined();
    });
});

describe("computeActiveOptionId", () => {
    it("points at the highlighted option only while open and holding focus on a field", () => {
        expect(ListboxUtils.computeActiveOptionId("list", 2, { focusModel: "activeDescendant", isOpen: true })).toBe(
            "list-option-2",
        );
        expect(
            ListboxUtils.computeActiveOptionId("list", 2, { focusModel: "activeDescendant", isOpen: false }),
        ).toBeUndefined();
        expect(ListboxUtils.computeActiveOptionId("list", 2, { focusModel: "roving", isOpen: true })).toBeUndefined();
        expect(
            ListboxUtils.computeActiveOptionId("list", undefined, { focusModel: "activeDescendant", isOpen: true }),
        ).toBeUndefined();
    });
});

describe("computeComboboxAttributes", () => {
    it("points at the list only while it is open, and says it completes only an editable field", () => {
        expect(
            ListboxUtils.computeComboboxAttributes({
                isOpen: true,
                listboxId: "list",
                activeOptionId: "list-option-0",
                isEditable: true,
            }),
        ).toEqual({
            "role": "combobox",
            "aria-haspopup": "listbox",
            "aria-autocomplete": "list",
            "aria-expanded": true,
            "aria-controls": "list",
            "aria-activedescendant": "list-option-0",
        });

        const closed = ListboxUtils.computeComboboxAttributes({
            isOpen: false,
            listboxId: "list",
            activeOptionId: undefined,
            isEditable: false,
        });

        expect(closed["aria-controls"]).toBeUndefined();
        expect(closed["aria-autocomplete"]).toBeUndefined();
        expect(closed["aria-expanded"]).toBe(false);
    });
});

describe("computeGroupFlags", () => {
    const group = { label: "Group", options: [{ value: "a" }, { value: "b" }] };

    it("reports none, some and all", () => {
        expect(ListboxUtils.computeGroupFlags(group, () => false).checkedState).toBe(false);
        expect(ListboxUtils.computeGroupFlags(group, (value) => value === "a").checkedState).toBe("mixed");
        expect(ListboxUtils.computeGroupFlags(group, () => true).checkedState).toBe(true);
    });
});

describe("computeEstimatedRowSize", () => {
    const option = (index: number) => 40 + index;
    const heading = (index: number) => 20 + index;

    it("asks about an option by its flat index", () => {
        expect(ListboxUtils.computeEstimatedRowSize(ROWS[2], option, heading)).toBe(41);
    });

    it("asks about a heading by its written position, and falls back to the option guess", () => {
        expect(ListboxUtils.computeEstimatedRowSize(ROWS[4], option, heading)).toBe(22);
        expect(ListboxUtils.computeEstimatedRowSize(ROWS[4], option, undefined)).toBe(40);
        expect(ListboxUtils.computeEstimatedRowSize(undefined, undefined, undefined)).toBe(0);
    });
});

describe("getPinnedRows", () => {
    it("pins the row carrying the highlighted option, and nothing without a highlight", () => {
        expect(ListboxUtils.getPinnedRows(ROWS, 3)).toEqual([5]);
        expect(ListboxUtils.getPinnedRows(ROWS, undefined)).toEqual([]);
        expect(ListboxUtils.getHighlightedRowIndex(ROWS, 9)).toBeUndefined();
    });
});

describe("getWindowedRuns", () => {
    const window = (indexes: number[]) => indexes.map((index) => ({ index, start: index * 10, size: 10 }));

    it("cuts consecutive rows into runs of one group, starting a run halfway down a group", () => {
        const runs = ListboxUtils.getWindowedRuns(window([0, 2, 3, 4, 5]), ROWS);

        expect(runs.map((run) => run.groupIndex)).toEqual([undefined, 1, 4]);
        expect(runs.map((run) => run.group?.label)).toEqual([undefined, "First", "Second"]);
        expect(runs.map((run) => run.rows.map((row) => row.index))).toEqual([[0], [2, 3], [4, 5]]);
    });
});

describe("createReachEndGuard", () => {
    it("claims each list once, however long it is, until reset", () => {
        const guard = ListboxUtils.createReachEndGuard<string[]>();
        const first = ["a"];

        expect(guard.claim(first)).toBe(true);
        expect(guard.claim(first)).toBe(false);
        expect(guard.claim(["b"]), "a replaced list of the same length is new").toBe(true);

        guard.reset();

        expect(guard.claim(["b"])).toBe(true);
    });
});

describe("createCursor", () => {
    const create = (overrides: { isOpen?: boolean; hasMoreOptions?: boolean; isHighlightExplicit?: boolean } = {}) => {
        const events: string[] = [];
        let isOpen = overrides.isOpen ?? true;

        const cursor = ListboxUtils.createCursor({
            focusModel: "activeDescendant",
            isHighlightExplicit: overrides.isHighlightExplicit,
            getListboxId: () => "list",
            getOptions: () => OPTIONS,
            getSelectedOptions: () => [],
            getIsDisabled: () => false,
            getIsOpen: () => isOpen,
            getIsFilterable: () => true,
            getHasMoreOptions: () => overrides.hasMoreOptions ?? false,
            onOpen: () => {
                events.push("open");
                isOpen = true;
            },
            onClose: () => {
                events.push("close");
                isOpen = false;
            },
            onPick: (value) => events.push(`pick ${value}`),
        });

        return { cursor, events };
    };

    it("walks the reachable options and wraps", () => {
        const { cursor } = create();

        cursor.handleKeyDown(keyEvent("ArrowDown"));
        expect(cursor.getHighlightedIndex()).toBe(2);

        cursor.handleKeyDown(keyEvent("ArrowDown"));
        cursor.handleKeyDown(keyEvent("ArrowDown"));
        expect(cursor.getHighlightedIndex(), "past the last it wraps to the first").toBe(0);
    });

    it("does not wrap while more options are still to come", () => {
        const { cursor } = create({ hasMoreOptions: true });

        cursor.handleKeyDown(keyEvent("ArrowUp"));
        expect(cursor.getHighlightedIndex()).toBe(0);
    });

    it("opens a closed list on an arrow without moving the highlight", () => {
        const { cursor, events } = create({ isOpen: false });

        cursor.handleKeyDown(keyEvent("ArrowDown"));

        expect(events).toEqual(["open"]);
        expect(cursor.getHighlightedIndex()).toBe(0);
    });

    it("refuses to pick a reachable disabled option, and closes on a pick", () => {
        const { cursor, events } = create();

        cursor.highlight("c");
        cursor.handleKeyDown(keyEvent("Enter"));
        expect(events, "nothing is picked on a disabled option").toEqual([]);

        cursor.highlight("d");
        cursor.handleKeyDown(keyEvent("Enter"));
        expect(events).toEqual(["pick d", "close"]);
    });

    it("lets Enter through when nothing is highlighted in an explicit list", () => {
        const { cursor, events } = create({ isHighlightExplicit: true });
        const event = keyEvent("Enter");

        cursor.handleKeyDown(event);

        expect(event.isPrevented, "the key is left to the field").toBe(false);
        expect(events).toEqual(["close"]);
    });

    it("reports whether a highlight changed anything, and notifies only then", () => {
        const { cursor } = create();
        let notified = 0;

        cursor.subscribe(() => notified++);

        expect(cursor.highlight("d")).toBe(true);
        expect(cursor.highlight("d")).toBe(false);
        expect(notified).toBe(1);
    });
});
