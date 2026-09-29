import { describe, expect, it } from "vitest";

import { FlattenerUtils } from "../../Abstracts/Flattener/Flattener.utils";
import type { TreeNodeRecord } from "./Tree.types";
import { TreeUtils } from "./Tree.utils";

type TreeNode<T> = TreeNodeRecord<T, unknown>;

const LEAF: TreeNode<string> = { value: "leaf" };

const NODES: TreeNode<string>[] = [
    {
        value: "src",
        children: [{ value: "index.ts" }, { value: "Lib", children: [{ value: "Tree.tsx" }] }],
    },
    { value: "package.json" },
];

const expandAll = () => true;

const expandNone = () => false;

const valuesOf = (nodes: TreeNode<string>[], computeIsExpanded: (value: string) => boolean) =>
    FlattenerUtils.getFlatRows(TreeUtils.getVisibleRows(nodes, computeIsExpanded)).map((row) => row.node.value);

describe("getIsBranch", () => {
    it("tells a branch from a leaf by whether it carries children", () => {
        expect(TreeUtils.getIsBranch(LEAF)).toBe(false);
        expect(TreeUtils.getIsBranch({ value: "src", children: [LEAF] })).toBe(true);
    });

    it("counts a branch with an empty list as a leaf, so nothing offers to open an empty box", () => {
        expect(TreeUtils.getIsBranch({ value: "src", children: [] })).toBe(false);
    });
});

describe("getVisibleRows", () => {
    it("leaves a collapsed branch's children out of the walk entirely", () => {
        expect(valuesOf(NODES, expandNone)).toEqual(["src", "package.json"]);
    });

    it("walks an expanded tree depth first, which is the order it is read in", () => {
        expect(valuesOf(NODES, expandAll)).toEqual(["src", "index.ts", "Lib", "Tree.tsx", "package.json"]);
    });

    it("opens only the branches asked for", () => {
        expect(valuesOf(NODES, (value) => value === "src")).toEqual(["src", "index.ts", "Lib", "package.json"]);
    });

    it("numbers each row by where it sits in the flat walk rather than among its siblings", () => {
        const flat = FlattenerUtils.getFlatRows(TreeUtils.getVisibleRows(NODES, expandAll));

        expect(flat.map((row) => row.index)).toEqual([0, 1, 2, 3, 4]);
        expect(flat.map((row) => row.depth)).toEqual([0, 1, 1, 2, 0]);
        expect(flat.map((row) => row.position)).toEqual([0, 0, 1, 0, 1]);
        expect(flat.map((row) => row.setSize)).toEqual([2, 2, 2, 1, 2]);
    });

    it("reports a leaf as collapsed however the expanded list is written", () => {
        expect(TreeUtils.getVisibleRows([LEAF], expandAll)[0].isExpanded).toBe(false);
    });

    it("returns nothing for no nodes", () => {
        expect(TreeUtils.getVisibleRows([], expandAll)).toEqual([]);
    });
});

const flatOf = (nodes: TreeNode<string>[], expanded: string[]) => {
    const rows = TreeUtils.getVisibleRows(nodes, (value) => expanded.includes(value));

    return { rows, flatRows: FlattenerUtils.getFlatRows(rows) };
};

const DISABLED_NODES: TreeNode<string>[] = [
    { value: "a" },
    { value: "b", isDisabled: true },
    { value: "c", isDisabled: true, isReachableWhenDisabled: true },
];

describe("computeIsNavigable", () => {
    it("skips a disabled node unless it asked to stay reachable", () => {
        const { flatRows } = flatOf(DISABLED_NODES, []);

        expect(flatRows.map(TreeUtils.computeIsNavigable)).toEqual([true, false, true]);
    });
});

describe("computeRovingRow", () => {
    it("prefers the row the keys reached, then the selection, then the first row", () => {
        const { flatRows } = flatOf(NODES, []);

        expect(TreeUtils.computeRovingRow(flatRows, "package.json", "src")?.node.value).toBe("package.json");
        expect(TreeUtils.computeRovingRow(flatRows, undefined, "package.json")?.node.value).toBe("package.json");
        expect(TreeUtils.computeRovingRow(flatRows, undefined, undefined)?.node.value).toBe("src");
    });
});

describe("expand and collapse", () => {
    it("open and close a branch, and hand back the same list when nothing changes", () => {
        const expanded = ["src"];

        expect(TreeUtils.expand(expanded, { value: "Lib" })).toEqual(["src", "Lib"]);
        expect(TreeUtils.expand(expanded, { value: "src" })).toBe(expanded);
        expect(TreeUtils.expand(expanded, { value: "Lib", isDisabled: true })).toBe(expanded);
        expect(TreeUtils.collapse(expanded, { value: "src" })).toEqual([]);
        expect(TreeUtils.collapse(expanded, { value: "src", isDisabled: true })).toBe(expanded);
    });
});

describe("expandSiblings", () => {
    it("opens every branch beside a row, leaving leaves alone", () => {
        const { rows, flatRows } = flatOf(NODES, ["src"]);
        const indexRow = flatRows.find((row) => row.node.value === "index.ts")!;

        expect(TreeUtils.expandSiblings(["src"], TreeUtils.computeSiblings(rows, flatRows, indexRow))).toEqual([
            "src",
            "Lib",
        ]);
        expect(TreeUtils.expandSiblings([], TreeUtils.computeSiblings(rows, flatRows, rows[0]))).toEqual(["src"]);
    });
});

describe("findCollapsedFocusTarget", () => {
    it("hands focus to the branch that closed when the focused row went with it", () => {
        const { flatRows } = flatOf(NODES, []);

        expect(TreeUtils.findCollapsedFocusTarget(["src"], [], flatRows, "index.ts")?.node.value).toBe("src");
    });

    it("does nothing when nothing closed, or the focused row is still drawn", () => {
        const { flatRows } = flatOf(NODES, ["src"]);

        expect(TreeUtils.findCollapsedFocusTarget(["src"], ["src"], flatRows, "index.ts")).toBeUndefined();
        expect(TreeUtils.findCollapsedFocusTarget(["src", "Lib"], ["src"], flatRows, "index.ts")).toBeUndefined();
    });
});

describe("computeKeyAction", () => {
    const actionOf = (key: string, value: string, expanded: string[], query?: string) => {
        const { flatRows } = flatOf(NODES, expanded);
        const current = flatRows.find((row) => row.node.value === value)!;
        const action = TreeUtils.computeKeyAction(key, current, {
            flatRows,
            navigable: flatRows,
            direction: "ltr",
            pushQuery: () => query,
            computeRowText: (row) => String(row.node.value),
        });

        return action && ("row" in action ? `${action.kind} ${action.row.node.value}` : action.kind);
    };

    it("opens a closed branch before entering it, and closes an open one before climbing", () => {
        expect(actionOf("ArrowRight", "src", [])).toBe("expand src");
        expect(actionOf("ArrowRight", "src", ["src"])).toBe("focus index.ts");
        expect(actionOf("ArrowLeft", "src", ["src"])).toBe("collapse src");
        expect(actionOf("ArrowLeft", "index.ts", ["src"])).toBe("focus src");
    });

    it("leaves the inward arrow alone on a leaf and the outward one on a root", () => {
        expect(actionOf("ArrowRight", "package.json", [])).toBeUndefined();
        expect(actionOf("ArrowLeft", "package.json", [])).toBeUndefined();
    });

    it("stops at the ends rather than wrapping", () => {
        expect(actionOf("ArrowUp", "src", [])).toBe("focus src");
        expect(actionOf("End", "src", [])).toBe("focus package.json");
    });

    it("claims the asterisk before the search can, and searches with anything else printable", () => {
        expect(actionOf("*", "src", [], "*")).toBe("expandSiblings src");
        expect(actionOf("p", "src", [], "p")).toBe("focus package.json");
        expect(actionOf("z", "src", [], "z")).toBe("claim");
    });

    it("activates a plain node from either key, and leaves Enter to a link", () => {
        expect(actionOf("Enter", "src", [])).toBe("activate src");

        const linked: TreeNode<string>[] = [{ value: "docs", href: "#docs" }];
        const { flatRows } = flatOf(linked, []);
        const opts = {
            flatRows,
            navigable: flatRows,
            direction: "ltr" as const,
            pushQuery: () => undefined,
            computeRowText: () => "",
        };

        expect(TreeUtils.computeKeyAction("Enter", flatRows[0], opts)).toBeUndefined();
        expect(TreeUtils.computeKeyAction(" ", flatRows[0], opts)?.kind).toBe("click");
    });
});
