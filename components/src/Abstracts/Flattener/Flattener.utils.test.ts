import { describe, expect, it } from "vitest";

import type { FlatRow, FlattenerDefs } from "./Flattener.types";
import { FlattenerUtils } from "./Flattener.utils";

type Node = { name: string; children?: Node[]; isOpenable?: boolean; isHeader?: boolean };

const NODES: Node[] = [
    { name: "src", children: [{ name: "index.ts" }, { name: "Lib", children: [{ name: "Tree.tsx" }] }] },
    { name: "package.json" },
];

const DEFS = { computeChildren: (node: Node) => node.children };

const namesOf = (rows: FlatRow<Node>[]) => FlattenerUtils.getFlatRows(rows).map((row) => row.node.name);

const walk = (nodes: Node[], defs: FlattenerDefs<Node>) =>
    FlattenerUtils.getFlatRows(FlattenerUtils.getRows(nodes, defs));

describe("getRows", () => {
    it("walks depth first, which is the order the rows are read in", () => {
        expect(namesOf(FlattenerUtils.getRows(NODES, DEFS))).toEqual([
            "src",
            "index.ts",
            "Lib",
            "Tree.tsx",
            "package.json",
        ]);
    });

    it("leaves a collapsed branch's children out of the walk entirely", () => {
        const rows = FlattenerUtils.getRows(NODES, { ...DEFS, computeIsExpanded: () => false });

        expect(namesOf(rows)).toEqual(["src", "package.json"]);
    });

    it("opens only the branches the caller says are open", () => {
        const rows = FlattenerUtils.getRows(NODES, { ...DEFS, computeIsExpanded: (node) => node.name === "src" });

        expect(namesOf(rows)).toEqual(["src", "index.ts", "Lib", "package.json"]);
    });

    it("numbers each row by where it sits in the flat walk rather than among its siblings", () => {
        const flat = walk(NODES, DEFS);

        expect(flat.map((row) => row.index)).toEqual([0, 1, 2, 3, 4]);
        expect(flat.map((row) => row.depth)).toEqual([0, 1, 1, 2, 0]);
        expect(flat.map((row) => row.position)).toEqual([0, 0, 1, 0, 1]);
        expect(flat.map((row) => row.setSize)).toEqual([2, 2, 2, 1, 2]);
    });

    it("points each row at the row it hangs from, so the parent is read rather than searched for", () => {
        const flat = walk(NODES, DEFS);

        expect(flat.map((row) => row.parentIndex)).toEqual([undefined, 0, 0, 2, undefined]);
    });

    it("reports a childless node as collapsed however the caller answers", () => {
        expect(
            FlattenerUtils.getRows([{ name: "leaf" }], { ...DEFS, computeIsExpanded: () => true })[0].isExpanded,
        ).toBe(false);
    });

    it("takes the caller's word for what is a branch, so an empty one can still open", () => {
        const rows = FlattenerUtils.getRows([{ name: "pending", isOpenable: true }], {
            ...DEFS,
            computeIsBranch: (node) => node.isOpenable ?? false,
        });

        expect(rows[0].isExpanded).toBe(true);
        expect(rows[0].rows).toEqual([]);
    });

    it("returns nothing for no nodes", () => {
        expect(FlattenerUtils.getRows([], DEFS)).toEqual([]);
    });
});

describe("entryOffset", () => {
    const HEADERED: Node[] = [
        { name: "a" },
        { name: "Group", isHeader: true, children: [{ name: "b" }, { name: "c" }] },
    ];

    const HEADERED_DEFS = { ...DEFS, computeIsEntry: (node: Node) => !node.isHeader };

    it("counts every row when every row is an entry, so the two numbers coincide", () => {
        const flat = walk(NODES, DEFS);

        expect(flat.map((row) => row.entryOffset)).toEqual(flat.map((row) => row.index));
    });

    it("skips the rows the caller does not count, so a header takes no number from the entries", () => {
        const flat = walk(HEADERED, HEADERED_DEFS);

        expect(flat.map((row) => row.node.name)).toEqual(["a", "Group", "b", "c"]);
        expect(flat.map((row) => row.isEntry)).toEqual([true, false, true, true]);
        expect(flat.filter((row) => row.isEntry).map((row) => row.entryOffset)).toEqual([0, 1, 2]);
    });

    it("reports on an uncounted row how many entries precede it, which is where its own run starts", () => {
        const rows = FlattenerUtils.getRows(HEADERED, HEADERED_DEFS);

        expect(rows.map((row) => row.entryOffset)).toEqual([0, 1]);
    });

    it("leaves no hole where an empty uncounted branch sits, because it contributes nothing", () => {
        const rows = FlattenerUtils.getRows(
            [{ name: "a" }, { name: "Empty", isHeader: true, children: [] }, { name: "b" }],
            HEADERED_DEFS,
        );

        expect(rows.map((row) => row.entryOffset)).toEqual([0, 1, 1]);
    });
});

describe("getEntryRowIndex", () => {
    it("finds the row an entry sits on, which is not its entry number once an uncounted row is in the way", () => {
        const flat = walk(
            [{ name: "a" }, { name: "Group", isHeader: true, children: [{ name: "b" }, { name: "c" }] }],
            { ...DEFS, computeIsEntry: (node: Node) => !node.isHeader },
        );

        expect(FlattenerUtils.getEntryRowIndex(flat, 0)).toBe(0);
        expect(FlattenerUtils.getEntryRowIndex(flat, 1)).toBe(2);
    });

    it("reports nothing found rather than a row that does not exist", () => {
        expect(FlattenerUtils.getEntryRowIndex(walk(NODES, DEFS), 9)).toBe(-1);
    });
});
