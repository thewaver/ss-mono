import { describe, expect, it } from "vitest";

import { TreemapUtils } from "../Treemap/Treemap.utils";
import type { IcicleNode, IcicleSpan } from "./Icicle.types";
import { IcicleUtils } from "./Icicle.utils";

const leaf = (value: string, weight: number): IcicleNode<string> => ({ value, weight });

const branch = (value: string, ...children: IcicleNode<string>[]): IcicleNode<string> => ({ value, children });

const DEEP_A = leaf("deepA", 1);
const DEEP_B = leaf("deepB", 1);
const TALL = branch("tall", DEEP_A, DEEP_B);
const HEAVY = leaf("heavy", 6);
const ROOT = branch("root", HEAVY, TALL);

const spans = IcicleUtils.computeSpans(ROOT, TreemapUtils.computeWeights(ROOT));

describe("computeSpans", () => {
    it("gives the root the whole height in column nought and its children the next column", () => {
        expect(spans.get(ROOT)).toEqual({ start: 0, end: 1, column: 0 });
        expect(spans.get(TALL)?.column).toBe(1);
        expect(spans.get(DEEP_A)?.column).toBe(2);
    });

    it("puts a child with a deeper tree under it first, even when a sibling outweighs it", () => {
        expect(spans.get(TALL)).toMatchObject({ start: 0, end: 0.25 });
        expect(spans.get(HEAVY)).toMatchObject({ start: 0.25, end: 1 });
    });
});

describe("computeView", () => {
    it("stretches the focus to the whole height and moves it to column nought, without clamping the rest", () => {
        const focus = spans.get(TALL)!;

        expect(IcicleUtils.computeView(spans.get(DEEP_B)!, focus)).toEqual({ start: 0.5, end: 1, column: 1 });
        expect(IcicleUtils.computeView(spans.get(HEAVY)!, focus)).toEqual({ start: 1, end: 4, column: 0 });
        expect(IcicleUtils.computeView(spans.get(ROOT)!, focus).column).toBe(-1);
    });
});

describe("getIsVisible", () => {
    it("counts a span with some height inside the box and inside the columns", () => {
        expect(IcicleUtils.getIsVisible({ start: 0, end: 0.5, column: 0 }, 3)).toBe(true);
        expect(IcicleUtils.getIsVisible({ start: 0.9, end: 1.4, column: 2 }, 3), "partly below").toBe(true);
        expect(IcicleUtils.getIsVisible({ start: 1, end: 2, column: 0 }, 3), "wholly below").toBe(false);
        expect(IcicleUtils.getIsVisible({ start: 0, end: 1, column: 3 }, 3), "past the last column").toBe(false);
        expect(IcicleUtils.getIsVisible({ start: 0, end: 1, column: -1 }, 3), "left of the first").toBe(false);
    });
});

describe("toRect", () => {
    it("gives every column the same width and a span its share of the height", () => {
        expect(IcicleUtils.toRect({ start: 0.25, end: 0.75, column: 1 }, { width: 600, height: 400 }, 3)).toEqual({
            x: 200,
            y: 100,
            width: 200,
            height: 200,
        });
    });
});

describe("computeStep", () => {
    const view = (node: IcicleNode<string>): { node: IcicleNode<string>; span: IcicleSpan } => ({
        node,
        span: IcicleUtils.computeView(spans.get(node)!, spans.get(ROOT)!),
    });
    const cells = [ROOT, TALL, HEAVY, DEEP_A, DEEP_B].map(view);
    const parents = new Map<IcicleNode<string>, IcicleNode<string>>([
        [TALL, ROOT],
        [HEAVY, ROOT],
        [DEEP_A, TALL],
        [DEEP_B, TALL],
    ]);
    const getParent = (node: IcicleNode<string>) => parents.get(node);

    it("moves up and down within a column and stops at its ends", () => {
        expect(IcicleUtils.computeStep("down", TALL, cells, getParent)).toBe(HEAVY);
        expect(IcicleUtils.computeStep("up", HEAVY, cells, getParent)).toBe(TALL);
        expect(IcicleUtils.computeStep("up", TALL, cells, getParent)).toBeUndefined();
        expect(IcicleUtils.computeStep("last", DEEP_A, cells, getParent)).toBe(DEEP_B);
    });

    it("moves left to the parent and right to the topmost child", () => {
        expect(IcicleUtils.computeStep("toParent", DEEP_B, cells, getParent)).toBe(TALL);
        expect(IcicleUtils.computeStep("toChildren", TALL, cells, getParent)).toBe(DEEP_A);
        expect(
            IcicleUtils.computeStep("toChildren", HEAVY, cells, getParent),
            "a leaf has nothing to the right",
        ).toBeUndefined();
    });
});
