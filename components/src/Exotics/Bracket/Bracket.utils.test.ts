import { describe, expect, it } from "vitest";

import type { BracketNode } from "./Bracket.types";
import { BracketUtils } from "./Bracket.utils";

const leaf = (value: string): BracketNode<string> => ({ value });

const pair = (value: string, first: BracketNode<string>, second: BracketNode<string>): BracketNode<string> => ({
    value,
    children: [first, second],
});

const FINAL = pair("Final", pair("Semi 1", leaf("A"), leaf("B")), pair("Semi 2", leaf("C"), leaf("D")));

const spell = (root: BracketNode<string>) =>
    BracketUtils.computeLayout(root)
        .placements.map((placement) => `${placement.id}@${placement.layer},${placement.cross}`)
        .join(" ");

describe("computeLayout", () => {
    it("gives every leaf its own row and every parent the middle of the rows it feeds from", () => {
        expect(spell(FINAL)).toBe("0@0,1.5 0.0@1,0.5 0.1@1,2.5 0.0.0@2,0 0.0.1@2,1 0.1.0@2,2 0.1.1@2,3");
    });

    it("counts the layers and the leaves, which is what the board is sized from", () => {
        const layout = BracketUtils.computeLayout(FINAL);

        expect({ layers: layout.layerCount, leaves: layout.leafCount }).toEqual({ layers: 3, leaves: 4 });
    });

    it("sits a node with one child level with it, which is what a bye looks like", () => {
        const bye: BracketNode<string> = { value: "Final", children: [{ value: "Semi", children: [leaf("A")] }] };
        const layout = BracketUtils.computeLayout(bye);

        expect(
            layout.placements.map((placement) => placement.cross),
            "all three share the one row",
        ).toEqual([0, 0, 0]);
    });

    it("has one placement and one row for a tree of one node", () => {
        expect(spell(leaf("Only"))).toBe("0@0,0");
    });

    it("orders the placements by layer and then down the board, so a walk can read them straight", () => {
        const layers = BracketUtils.computeLayout(FINAL).placements.map((placement) => placement.layer);

        expect([...layers].sort((first, second) => first - second)).toEqual(layers);
    });
});

describe("getFacingEdge", () => {
    const START = 100;
    const EXTENT = 40;

    it("faces the leaves away from the root and the root away from the leaves", () => {
        expect(
            BracketUtils.getFacingEdge(START, EXTENT, "end", false),
            "with the root at the end the leaves are earlier, so a parent faces them from its near edge",
        ).toBe(START);
        expect(
            BracketUtils.getFacingEdge(START, EXTENT, "end", true),
            "and a child faces the root from its far edge",
        ).toBe(START + EXTENT);
    });

    it("swaps both when the board is turned round", () => {
        expect(BracketUtils.getFacingEdge(START, EXTENT, "start", false)).toBe(START + EXTENT);
        expect(BracketUtils.getFacingEdge(START, EXTENT, "start", true)).toBe(START);
    });

    it("never answers with the edge a line would have to cross the box to reach", () => {
        for (const rootSide of ["start", "end"] as const) {
            const parent = BracketUtils.getFacingEdge(START, EXTENT, rootSide, false);
            const child = BracketUtils.getFacingEdge(START, EXTENT, rootSide, true);

            expect(parent, "the two are opposite edges of the same box").not.toBe(child);
        }
    });
});

describe("computeStepId", () => {
    const placements = BracketUtils.computeLayout(FINAL).placements;

    it("steps toward the root by following the node that this one feeds", () => {
        expect(BracketUtils.computeStepId("toRoot", "0.0.0", placements)).toBe("0.0");
        expect(BracketUtils.computeStepId("toRoot", "0", placements), "the final feeds nobody").toBeUndefined();
    });

    it("steps toward the leaves by the middle of the nodes that feed this one", () => {
        expect(BracketUtils.computeStepId("toLeaves", "0.0", placements)).toBe("0.0.0");
        expect(BracketUtils.computeStepId("toLeaves", "0.0.0", placements), "a leaf feeds from nobody").toBeUndefined();
    });

    it("steps up and down inside one layer, in the order the board draws them", () => {
        expect(BracketUtils.computeStepId("next", "0.0.0", placements)).toBe("0.0.1");
        expect(BracketUtils.computeStepId("previous", "0.0.1", placements)).toBe("0.0.0");
    });

    it("stops at the ends of a layer rather than wrapping into another one", () => {
        expect(BracketUtils.computeStepId("previous", "0.0.0", placements)).toBeUndefined();
        expect(BracketUtils.computeStepId("next", "0.1.1", placements)).toBeUndefined();
    });

    it("jumps to the ends of the layer it is already in", () => {
        expect(BracketUtils.computeStepId("first", "0.1.0", placements)).toBe("0.0.0");
        expect(BracketUtils.computeStepId("last", "0.0.0", placements)).toBe("0.1.1");
    });

    it("has nowhere to go from a node the board does not hold", () => {
        expect(BracketUtils.computeStepId("next", "9.9", placements)).toBeUndefined();
    });
});

describe("getIsOnRoute", () => {
    it("holds the starting node and every node between it and the root", () => {
        expect(["0", "0.1", "0.1.0"].map((id) => BracketUtils.getIsOnRoute(id, "0.1.0"))).toEqual([true, true, true]);
    });

    it("leaves out siblings, cousins and the nodes that feed the start", () => {
        expect(["0.0", "0.1.1", "0.1.0.0"].map((id) => BracketUtils.getIsOnRoute(id, "0.1.0"))).toEqual([
            false,
            false,
            false,
        ]);
    });

    it("reads a separator rather than a shared prefix, so a tenth child is not on its first sibling's route", () => {
        expect(BracketUtils.getIsOnRoute("0.1", "0.10")).toBe(false);
    });

    it("has no route when nothing is focused", () => {
        expect(BracketUtils.getIsOnRoute("0", undefined)).toBe(false);
    });
});

describe("findNode", () => {
    it("follows an id's positions down from the root", () => {
        expect(BracketUtils.findNode(FINAL, "0").value).toBe("Final");
        expect(BracketUtils.findNode(FINAL, "0.1.0").value).toBe("C");
    });
});

describe("computeGeometry", () => {
    const layout = BracketUtils.computeLayout(FINAL);
    const opts = {
        nodeSize: { width: 100, height: 20 },
        layerGap: 10,
        crossGap: 4,
        orientation: "horizontal" as const,
        rootSide: "end" as const,
        headerExtent: 0,
    };

    it("sizes the board by its layers along and its first round across", () => {
        expect(BracketUtils.computeGeometry(layout, opts).boardSize).toEqual({ width: 320, height: 92 });
        expect(BracketUtils.computeGeometry(layout, { ...opts, orientation: "vertical" }).boardSize).toEqual({
            width: 412,
            height: 80,
        });
    });

    it("puts the final at the end it was told, with the headers ahead of every match", () => {
        const geometry = BracketUtils.computeGeometry(layout, { ...opts, headerExtent: 24 });
        const final = BracketUtils.findPlacement(layout.placements, "0")!;

        expect(BracketUtils.computeInset(geometry, final)).toEqual({ left: 220, top: 24 + 1.5 * 24 });
        expect(BracketUtils.computeHeaderBox(geometry, 0)).toEqual({ left: 220, top: 0, width: 100, height: 24 });

        const turned = BracketUtils.computeGeometry(layout, { ...opts, rootSide: "start" });

        expect(BracketUtils.computeInset(turned, final).left).toBe(0);
    });

    it("joins every match that feeds another, edge to edge, marking the focused route", () => {
        const geometry = BracketUtils.computeGeometry(layout, opts);
        const connectors = BracketUtils.computeConnectors(layout, geometry, "b", "0.0.1");

        expect(connectors).toHaveLength(6);
        const onRoute = connectors.filter((connector) => connector.isOnFocusedRoute);

        expect(onRoute.map((connector) => connector.childId)).toEqual(["0.0", "0.0.1"]);

        const toFinal = connectors.find((connector) => connector.childId === "0.0")!;

        expect(toFinal.from.x, "leaves the final's edge facing its feeders").toBe(220);
        expect(toFinal.to.x, "arrives at the semi's edge facing the final").toBe(210);
    });
});

describe("getKeyStep", () => {
    it("points the arrow along the board at the final towards it", () => {
        expect(BracketUtils.getKeyStep("ArrowRight", "horizontal", "end")).toBe("toRoot");
        expect(BracketUtils.getKeyStep("ArrowLeft", "horizontal", "end")).toBe("toLeaves");
        expect(BracketUtils.getKeyStep("ArrowLeft", "horizontal", "start")).toBe("toRoot");
        expect(BracketUtils.getKeyStep("ArrowUp", "vertical", "start")).toBe("toRoot");
    });

    it("moves within a layer across the board, and leaves other keys alone", () => {
        expect(BracketUtils.getKeyStep("ArrowDown", "horizontal", "end")).toBe("next");
        expect(BracketUtils.getKeyStep("ArrowLeft", "vertical", "end")).toBe("previous");
        expect(BracketUtils.getKeyStep("End", "vertical", "end")).toBe("last");
        expect(BracketUtils.getKeyStep("x", "vertical", "end")).toBeUndefined();
    });
});

describe("resolveRovingId", () => {
    const stops = BracketUtils.computeLayout(FINAL).placements;

    it("keeps the last focused match while it can be picked, and takes the first otherwise", () => {
        expect(BracketUtils.resolveRovingId(stops, "0.1")).toBe("0.1");
        expect(BracketUtils.resolveRovingId(stops, "9")).toBe(stops[0].id);
        expect(BracketUtils.resolveRovingId([], "0")).toBeUndefined();
    });
});
