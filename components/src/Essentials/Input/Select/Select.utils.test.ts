import { describe, expect, it } from "vitest";

import { FlattenerUtils } from "../../../Abstracts/Flattener/Flattener.utils";
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
 * needs the same number written on each row. Both now read it off one walk, which is `Abstracts/Flattener`;
 * these pin the numbering that walk hands back for a grouped list, since that is what `Select` relies on.
 */
describe("getItemRows", () => {
    it("reports how many options precede each written item", () => {
        expect(SelectUtils.getItemRows(ITEMS).map((row) => row.entryOffset)).toEqual([0, 1]);
    });

    it("counts a group as all of its options rather than as one item", () => {
        const items: SelectItem<string>[] = [{ label: "Group", options: [OPTION_A, OPTION_B] }, OPTION_C];

        expect(SelectUtils.getItemRows(items).map((row) => row.entryOffset)).toEqual([0, 2]);
    });

    it("leaves no hole where an empty group sits, because it contributes nothing to the walk", () => {
        const items: SelectItem<string>[] = [OPTION_A, { label: "Empty", options: [] }, OPTION_B];

        expect(SelectUtils.getItemRows(items).map((row) => row.entryOffset)).toEqual([0, 1, 1]);
    });

    it("emits a row for the group header and one per option, numbering only the options", () => {
        const rows = FlattenerUtils.getFlatRows(SelectUtils.getItemRows(ITEMS));

        expect(rows.map((row) => row.node)).toEqual([OPTION_A, ITEMS[1], OPTION_B, OPTION_C]);
        expect(rows.map((row) => row.isEntry)).toEqual([true, false, true, true]);
        expect(rows.filter((row) => row.isEntry).map((row) => row.entryOffset)).toEqual([0, 1, 2]);
    });

    it("numbers the options the same way the flat option list does, which is the agreement being kept", () => {
        const rows = FlattenerUtils.getFlatRows(SelectUtils.getItemRows(ITEMS));

        expect(rows.filter((row) => row.isEntry).map((row) => row.node)).toEqual(SelectUtils.getFlatOptions(ITEMS));
    });
});

describe("getGroupRowIndex", () => {
    it("sends an option to the row its header sits on, and a header to itself, so a run reads as one group", () => {
        const rows = FlattenerUtils.getFlatRows(SelectUtils.getItemRows(ITEMS));

        expect(rows.map(SelectUtils.getGroupRowIndex)).toEqual([undefined, 1, 1, 1]);
    });
});
