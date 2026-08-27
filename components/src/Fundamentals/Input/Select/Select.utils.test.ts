import { describe, expect, it } from "vitest";

import type { SelectItem } from "./Select.types";
import { SelectUtils } from "./Select.utils";

const OPTION_A = { value: "a", label: "A" };
const OPTION_B = { value: "b", label: "B" };
const OPTION_C = { value: "c", label: "C" };

const ITEMS: SelectItem<string>[] = [OPTION_A, { label: "Group", options: [OPTION_B, OPTION_C] }];

describe("getIsGroup", () => {
    it("tells a group from an option by whether it carries options", () => {
        expect(SelectUtils.getIsGroup(OPTION_A)).toBe(false);
        expect(SelectUtils.getIsGroup({ label: "Group", options: [] })).toBe(true);
    });
});

describe("getFlatOptions", () => {
    it("flattens one level of grouping while keeping the written order", () => {
        expect(SelectUtils.getFlatOptions(ITEMS)).toEqual([OPTION_A, OPTION_B, OPTION_C]);
    });

    it("keeps an ungrouped list as it is", () => {
        expect(SelectUtils.getFlatOptions([OPTION_A, OPTION_B])).toEqual([OPTION_A, OPTION_B]);
    });

    it("drops an empty group rather than leaving a hole in the walk", () => {
        expect(SelectUtils.getFlatOptions([OPTION_A, { label: "Empty", options: [] }, OPTION_B])).toEqual([
            OPTION_A,
            OPTION_B,
        ]);
    });

    it("returns nothing for no items", () => {
        expect(SelectUtils.getFlatOptions([])).toEqual([]);
    });
});

/**
 * The running option index is what the two rendering paths have to agree on: the mounted list walks the
 * written items and needs the flat index of each option inside them, while the windowed list walks rows and
 * needs the same number written on each row. It used to be worked out twice, once in each path, so these pin
 * the single walk they now share.
 */
describe("getItemOffsets", () => {
    it("reports how many options precede each written item", () => {
        expect(SelectUtils.getItemOffsets(ITEMS)).toEqual([0, 1]);
    });

    it("counts a group as all of its options rather than as one item", () => {
        expect(SelectUtils.getItemOffsets([{ label: "Group", options: [OPTION_A, OPTION_B] }, OPTION_C])).toEqual([
            0, 2,
        ]);
    });

    it("leaves no hole where an empty group sits, because it contributes nothing to the walk", () => {
        expect(SelectUtils.getItemOffsets([OPTION_A, { label: "Empty", options: [] }, OPTION_B])).toEqual([0, 1, 1]);
    });
});

describe("getRows", () => {
    it("emits a row for the group header and one per option, numbering only the options", () => {
        expect(SelectUtils.getRows(ITEMS)).toEqual([
            { group: undefined, groupIndex: undefined, option: OPTION_A, optionIndex: 0 },
            { group: ITEMS[1], groupIndex: 1, option: undefined, optionIndex: undefined },
            { group: ITEMS[1], groupIndex: 1, option: OPTION_B, optionIndex: 1 },
            { group: ITEMS[1], groupIndex: 1, option: OPTION_C, optionIndex: 2 },
        ]);
    });

    it("numbers the options the same way the offsets do, which is the agreement being kept", () => {
        const rows = SelectUtils.getRows(ITEMS);
        const offsets = SelectUtils.getItemOffsets(ITEMS);

        expect(rows.filter((row) => row.option !== undefined).map((row) => row.optionIndex)).toEqual(
            SelectUtils.getFlatOptions(ITEMS).map((_option, index) => index),
        );
        expect(rows[0].optionIndex).toBe(offsets[0]);
        expect(rows[2].optionIndex).toBe(offsets[1]);
    });
});

describe("getRowIndexOfOption", () => {
    it("finds the row an option sits on, which is not its option index once a header is in the way", () => {
        const rows = SelectUtils.getRows(ITEMS);

        expect(SelectUtils.getRowIndexOfOption(rows, 0)).toBe(0);
        expect(SelectUtils.getRowIndexOfOption(rows, 1)).toBe(2);
    });

    it("reports nothing found rather than a row that does not exist", () => {
        expect(SelectUtils.getRowIndexOfOption(SelectUtils.getRows(ITEMS), 9)).toBe(-1);
    });
});
