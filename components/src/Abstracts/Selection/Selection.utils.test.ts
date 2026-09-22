import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import type { SelectionMode } from "./Selection.types";
import { SelectionUtils } from "./Selection.utils";

type Row = { id: string };

type Node = { id: string; children?: Node[] };

const ROWS: Row[] = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];

const LEAF: Node = { id: "leaf" };

const TREE: Node = {
    id: "root",
    children: [{ id: "one", children: [{ id: "one.one" }, { id: "one.two" }] }, { id: "two" }],
};

const BRANCH_DEFS = { computeChildren: (node: Node) => node.children };

const findNode = (node: Node, id: string): Node => {
    if (node.id === id) return node;

    return (node.children ?? []).map((child) => findNode(child, id)).find((found) => found !== undefined)!;
};

const buildHandle = (mode: SelectionMode, opts?: { isDisabled?: boolean; items?: Row[] }) => {
    const [getItems, setItems] = createSignal(opts?.items ?? ROWS);
    const [getSelection, setSelection] = createSignal<Row[]>([]);

    let writes = 0;

    const handle = SelectionUtils.create(() => opts?.isDisabled ?? false, {
        getMode: () => mode,
        getItems,
        selectionSignal: [
            getSelection,
            (next) => {
                writes++;
                setSelection(next);
            },
        ],
    });

    return { handle, getSelection, setItems, getWrites: () => writes };
};

describe("getToggled", () => {
    it("adds an item that was not picked", () => {
        expect(SelectionUtils.getToggled([ROWS[0]], ROWS[1])).toEqual([ROWS[0], ROWS[1]]);
    });

    it("removes an item that was already picked", () => {
        expect(SelectionUtils.getToggled([ROWS[0], ROWS[1]], ROWS[0])).toEqual([ROWS[1]]);
    });
});

describe("getMerged", () => {
    it("leaves what was already picked where it was and adds only what is new", () => {
        expect(SelectionUtils.getMerged([ROWS[0], ROWS[1]], [ROWS[1], ROWS[2]])).toEqual([ROWS[0], ROWS[1], ROWS[2]]);
    });
});

describe("getRange", () => {
    it("takes the run between two items whichever way round they were given", () => {
        expect(SelectionUtils.getRange(ROWS, ROWS[1], ROWS[3])).toEqual([ROWS[1], ROWS[2], ROWS[3]]);
        expect(SelectionUtils.getRange(ROWS, ROWS[3], ROWS[1])).toEqual([ROWS[1], ROWS[2], ROWS[3]]);
    });

    it("takes one item when both ends are the same", () => {
        expect(SelectionUtils.getRange(ROWS, ROWS[2], ROWS[2])).toEqual([ROWS[2]]);
    });

    it("takes nothing when an end is not in the list", () => {
        expect(SelectionUtils.getRange(ROWS, { id: "gone" }, ROWS[1])).toEqual([]);
    });
});

describe("getBranchItems", () => {
    it("takes a branch and everything under it, however deep", () => {
        expect(SelectionUtils.getBranchItems(TREE, BRANCH_DEFS).map((node) => node.id)).toEqual([
            "root",
            "one",
            "one.one",
            "one.two",
            "two",
        ]);
    });

    it("takes a leaf on its own", () => {
        expect(SelectionUtils.getBranchItems(LEAF, BRANCH_DEFS)).toEqual([LEAF]);
    });
});

describe("getBranchState", () => {
    it("answers for a leaf by whether it is picked", () => {
        expect(SelectionUtils.getBranchState(LEAF, [LEAF], BRANCH_DEFS)).toBe(true);
        expect(SelectionUtils.getBranchState(LEAF, [], BRANCH_DEFS)).toBe(false);
    });

    it("reports a branch as ticked only when everything under it is", () => {
        const every = SelectionUtils.getBranchItems(TREE, BRANCH_DEFS);

        expect(SelectionUtils.getBranchState(TREE, every, BRANCH_DEFS)).toBe(true);
    });

    it("reports a branch as empty when nothing under it is picked", () => {
        expect(SelectionUtils.getBranchState(TREE, [], BRANCH_DEFS)).toBe(false);
    });

    it("reports a branch as half-ticked when its children disagree", () => {
        expect(SelectionUtils.getBranchState(TREE, [findNode(TREE, "two")], BRANCH_DEFS)).toBe("mixed");
    });

    it("carries a half-ticked child up to its parent", () => {
        const selection = [findNode(TREE, "one.one"), findNode(TREE, "two")];

        expect(SelectionUtils.getBranchState(TREE, selection, BRANCH_DEFS)).toBe("mixed");
    });

    it("ignores a branch's own place in the selection and follows its children", () => {
        expect(SelectionUtils.getBranchState(TREE, [TREE], BRANCH_DEFS)).toBe(false);
    });
});

describe("getBranchSelection", () => {
    it("fills a half-ticked branch rather than clearing it", () => {
        const next = SelectionUtils.getBranchSelection(TREE, [findNode(TREE, "two")], BRANCH_DEFS);

        expect(SelectionUtils.getBranchState(TREE, next, BRANCH_DEFS)).toBe(true);
    });

    it("empties a branch that was fully ticked", () => {
        const every = SelectionUtils.getBranchItems(TREE, BRANCH_DEFS);

        expect(SelectionUtils.getBranchSelection(TREE, every, BRANCH_DEFS)).toEqual([]);
    });

    it("leaves items outside the branch alone", () => {
        const one = findNode(TREE, "one");
        const two = findNode(TREE, "two");
        const next = SelectionUtils.getBranchSelection(one, [two], BRANCH_DEFS);

        expect(next).toContain(two);
        expect(next).toContain(findNode(TREE, "one.one"));
    });
});

describe("create", () => {
    it("ignores every gesture when nothing can be picked", () => {
        const { handle, getSelection } = buildHandle("none");

        handle.pick(ROWS[0]);
        handle.selectAll();

        expect(getSelection()).toEqual([]);
    });

    it("ignores every gesture while the control is off", () => {
        const { handle, getSelection } = buildHandle("multiple", { isDisabled: true });

        handle.pick(ROWS[0]);
        handle.selectAll();

        expect(getSelection()).toEqual([]);
    });

    it("ignores an item that is not in the list", () => {
        const { handle, getSelection } = buildHandle("multiple");

        handle.pick({ id: "gone" });

        expect(getSelection()).toEqual([]);
    });

    it("replaces what was picked when only one thing can be", () => {
        const { handle, getSelection } = buildHandle("single");

        handle.pick(ROWS[0]);
        handle.pick(ROWS[1]);

        expect(getSelection()).toEqual([ROWS[1]]);
    });

    it("unpicks the single item when it is picked again with a modifier", () => {
        const { handle, getSelection } = buildHandle("single");

        handle.pick(ROWS[0]);
        handle.pick(ROWS[0], { isToggling: true });

        expect(getSelection()).toEqual([]);
    });

    it("replaces the selection on a plain pick even where many are allowed", () => {
        const { handle, getSelection } = buildHandle("multiple");

        handle.pick(ROWS[0], { isToggling: true });
        handle.pick(ROWS[1]);

        expect(getSelection()).toEqual([ROWS[1]]);
    });

    it("adds to the selection when the pick is a toggle", () => {
        const { handle, getSelection } = buildHandle("multiple");

        handle.pick(ROWS[0], { isToggling: true });
        handle.pick(ROWS[2], { isToggling: true });

        expect(getSelection()).toEqual([ROWS[0], ROWS[2]]);
    });

    it("takes the whole run from the last plain pick when the gesture extends", () => {
        const { handle, getSelection } = buildHandle("multiple");

        handle.pick(ROWS[1]);
        handle.pick(ROWS[3], { isExtending: true });

        expect(getSelection()).toEqual([ROWS[1], ROWS[2], ROWS[3]]);
    });

    it("leaves the run's start where it was, so extending twice measures from the same place", () => {
        const { handle, getSelection } = buildHandle("multiple");

        handle.pick(ROWS[2]);
        handle.pick(ROWS[3], { isExtending: true });
        handle.pick(ROWS[0], { isExtending: true });

        expect(getSelection()).toEqual([ROWS[2], ROWS[3], ROWS[0], ROWS[1]]);
    });

    it("keeps the run's start on the item it was on when the list is re-ordered underneath it", () => {
        const { handle, getSelection, setItems } = buildHandle("multiple");

        handle.pick(ROWS[1]);

        setItems([ROWS[3], ROWS[2], ROWS[1], ROWS[0]]);

        handle.pick(ROWS[3], { isExtending: true });

        expect(getSelection()).toEqual([ROWS[1], ROWS[3], ROWS[2]]);
    });

    it("starts the run where the gesture landed when nothing has been picked yet", () => {
        const { handle, getSelection } = buildHandle("multiple");

        handle.pick(ROWS[2], { isExtending: true });

        expect(getSelection()).toEqual([ROWS[2]]);
    });

    it("does not write when the gesture leaves the selection as it was", () => {
        const { handle, getWrites } = buildHandle("multiple");

        handle.pick(ROWS[0]);
        handle.pick(ROWS[2], { isExtending: true });

        const before = getWrites();

        handle.pick(ROWS[2], { isExtending: true });

        expect(getWrites()).toBe(before);
    });

    it("takes everything only where many can be picked", () => {
        const many = buildHandle("multiple");
        const one = buildHandle("single");

        many.handle.selectAll();
        one.handle.selectAll();

        expect(many.getSelection()).toEqual(ROWS);
        expect(one.getSelection()).toEqual([]);
    });

    it("empties the selection when cleared", () => {
        const { handle, getSelection } = buildHandle("multiple");

        handle.pick(ROWS[0], { isToggling: true });
        handle.clear();

        expect(getSelection()).toEqual([]);
    });
});
