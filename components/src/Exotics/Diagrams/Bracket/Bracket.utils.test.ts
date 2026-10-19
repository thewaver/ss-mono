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
        expect(BracketUtils.computeStepId("to_root", "0.0.0", placements)).toBe("0.0");
        expect(BracketUtils.computeStepId("to_root", "0", placements), "the final feeds nobody").toBeUndefined();
    });

    it("steps toward the leaves by the middle of the nodes that feed this one", () => {
        expect(BracketUtils.computeStepId("to_leaves", "0.0", placements)).toBe("0.0.0");
        expect(
            BracketUtils.computeStepId("to_leaves", "0.0.0", placements),
            "a leaf feeds from nobody",
        ).toBeUndefined();
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

    it("lists the focused route last, so painting in order draws it over the lines it crosses", () => {
        const geometry = BracketUtils.computeGeometry(layout, opts);
        const connectors = BracketUtils.computeConnectors(layout, geometry, "b", "0.0.1");
        const firstOnRoute = connectors.findIndex((connector) => connector.isOnFocusedRoute);

        expect(firstOnRoute).toBeGreaterThan(0);
        expect(connectors.slice(firstOnRoute).every((connector) => connector.isOnFocusedRoute)).toBe(true);
    });
});

describe("getKeyStep", () => {
    it("points the arrow along the board at the final towards it", () => {
        expect(BracketUtils.getKeyStep("ArrowRight", "horizontal", "end")).toBe("to_root");
        expect(BracketUtils.getKeyStep("ArrowLeft", "horizontal", "end")).toBe("to_leaves");
        expect(BracketUtils.getKeyStep("ArrowLeft", "horizontal", "start")).toBe("to_root");
        expect(BracketUtils.getKeyStep("ArrowUp", "vertical", "start")).toBe("to_root");
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

const DEEP = pair(
    "Final",
    pair("Semi 1", pair("Quarter 1", leaf("A"), leaf("B")), pair("Quarter 2", leaf("C"), leaf("D"))),
    pair("Semi 2", pair("Quarter 3", leaf("E"), leaf("F")), pair("Quarter 4", leaf("G"), leaf("H"))),
);

const DEEP_LAYOUT = BracketUtils.computeLayout(DEEP);

const ID_OF = Object.fromEntries(
    DEEP_LAYOUT.placements.map((placement) => [BracketUtils.findNode(DEEP, placement.id).value, placement.id]),
);

const familyOf = (focused: string | undefined) => {
    const anchorId = BracketUtils.getFamilyAnchorId(focused === undefined ? undefined : ID_OF[focused]);

    return DEEP_LAYOUT.placements
        .filter((placement) => BracketUtils.getIsInFamily(placement.id, anchorId))
        .map((placement) => BracketUtils.findNode(DEEP, placement.id).value);
};

describe("getParentId", () => {
    it("takes the last position off an id, and the root has no parent", () => {
        expect(BracketUtils.getParentId("0.1.10")).toBe("0.1");
        expect(BracketUtils.getParentId("0")).toBeUndefined();
    });
});

describe("the family view's rows", () => {
    it("shows, for a node in the middle, what it feeds, it with its siblings, and everything that feeds them", () => {
        expect(familyOf("Semi 1")).toEqual([
            "Final",
            "Semi 1",
            "Semi 2",
            "Quarter 1",
            "Quarter 2",
            "Quarter 3",
            "Quarter 4",
        ]);
        expect(familyOf("Quarter 2"), "the same rule one round further out").toEqual([
            "Semi 1",
            "Quarter 1",
            "Quarter 2",
            "A",
            "B",
            "C",
            "D",
        ]);
    });

    it("shows two rows for a leaf, because nothing feeds it: what it feeds, and it with its siblings", () => {
        expect(familyOf("B")).toEqual(["Quarter 1", "A", "B"]);
    });

    it("shows two rows for the root, because it feeds nothing: the root and the nodes that feed it", () => {
        expect(familyOf("Final")).toEqual(["Final", "Semi 1", "Semi 2"]);
    });

    it("shows the root's rows when nothing is focused", () => {
        expect(familyOf(undefined)).toEqual(familyOf("Final"));
    });

    it("reads a separator rather than a shared prefix, so a tenth child is not counted as the first one's", () => {
        expect(BracketUtils.getIsInFamily("0.10", "0.1")).toBe(false);
    });
});

describe("computeFamilyLayout", () => {
    const spellFamily = (anchorId: string | undefined) =>
        BracketUtils.computeFamilyLayout(DEEP_LAYOUT, anchorId)
            .placements.map(
                (placement) =>
                    `${BracketUtils.findNode(DEEP, placement.id).value}@${placement.layer},${placement.cross}`,
            )
            .join(" ");

    it("places a family as though the tree ended at its last row, with its top row first", () => {
        expect(spellFamily(ID_OF["Semi 1"])).toBe(
            "Semi 1@0,1.5 Quarter 1@1,0.5 Quarter 2@1,2.5 A@2,0 B@2,1 C@2,2 D@2,3",
        );
        expect(spellFamily(ID_OF["Quarter 1"])).toBe("Quarter 1@0,0.5 A@1,0 B@1,1");
        expect(spellFamily(undefined)).toBe("Final@0,0.5 Semi 1@1,0 Semi 2@1,1");
    });
});

describe("computeFamilyExtent", () => {
    it("is as deep and as wide as the largest family", () => {
        expect(BracketUtils.computeFamilyExtent(DEEP_LAYOUT)).toEqual({ layerCount: 3, leafCount: 4 });
    });

    it("counts an uneven family by the rows it actually holds", () => {
        const uneven: BracketNode<string> = {
            value: "Top",
            children: [pair("Left", leaf("A"), leaf("B")), { value: "Right", children: [leaf("C")] }, leaf("Lone")],
        };

        expect(BracketUtils.computeFamilyExtent(BracketUtils.computeLayout(uneven))).toEqual({
            layerCount: 3,
            leafCount: 4,
        });
    });
});

describe("findNodeId", () => {
    it("finds a node by identity, not by value", () => {
        const twin: BracketNode<string> = pair("Final", leaf("Same"), leaf("Same"));
        const layout = BracketUtils.computeLayout(twin);

        expect(BracketUtils.findNodeId(twin, layout, twin.children![1])).toBe("0.1");
    });

    it("answers undefined for a node that is not in the tree", () => {
        expect(BracketUtils.findNodeId(FINAL, BracketUtils.computeLayout(FINAL), leaf("A"))).toBeUndefined();
    });
});

describe("computeFamilyStep", () => {
    const [semi1, semi2] = FINAL.children!;

    it("walks from the root's own family to the one the root names, and back", () => {
        expect(BracketUtils.computeFamilyStep(FINAL, undefined, "to_leaves")).toBe(FINAL);
        expect(BracketUtils.computeFamilyStep(FINAL, FINAL, "to_root")).toBeUndefined();
    });

    it("moves a stage out onto the middle child, and back in to the parent", () => {
        expect(BracketUtils.computeFamilyStep(FINAL, FINAL, "to_leaves")).toBe(semi1);
        expect(BracketUtils.computeFamilyStep(FINAL, semi2, "to_root")).toBe(FINAL);
    });

    it("moves across a stage to the neighbor", () => {
        expect(BracketUtils.computeFamilyStep(FINAL, semi1, "next")).toBe(semi2);
        expect(BracketUtils.computeFamilyStep(FINAL, semi2, "previous")).toBe(semi1);
    });

    it("stays put where there is nowhere to go, since a leaf cannot name a family", () => {
        expect(BracketUtils.computeFamilyStep(FINAL, semi1, "to_leaves"), "its children are all leaves").toBe(semi1);
        expect(BracketUtils.computeFamilyStep(FINAL, semi2, "next"), "the stage does not wrap").toBe(semi2);
        expect(BracketUtils.computeFamilyStep(FINAL, undefined, "to_root")).toBeUndefined();
    });
});

describe("framing a family", () => {
    const DRAW = pair(
        "Final",
        pair("Semi 1", pair("Q1", leaf("A"), leaf("B")), pair("Q2", leaf("C"), leaf("D"))),
        pair("Semi 2", pair("Q3", leaf("E"), leaf("F")), pair("Q4", leaf("G"), leaf("H"))),
    );
    const LAYOUT = BracketUtils.computeLayout(DRAW);
    const GEOMETRY = BracketUtils.computeGeometry(LAYOUT, {
        nodeSize: { width: 100, height: 30 },
        layerGap: 40,
        crossGap: 10,
        orientation: "horizontal",
        rootSide: "end",
        headerExtent: 20,
    });
    const ASPECT = 0.5;

    const inView = (anchorId: string | undefined) =>
        BracketUtils.computeFamilyInView(
            LAYOUT,
            GEOMETRY,
            BracketUtils.computeFamilyView(LAYOUT, GEOMETRY, anchorId),
            ASPECT,
        );

    it("finds the family a view was framed on, at every depth", () => {
        expect(BracketUtils.getFamilyAnchorIds(LAYOUT).map((anchorId) => inView(anchorId)?.anchorId)).toEqual(
            BracketUtils.getFamilyAnchorIds(LAYOUT),
        );
    });

    it("finds no family in a view of the whole board", () => {
        expect(
            BracketUtils.computeFamilyInView(LAYOUT, GEOMETRY, BracketUtils.computeWholeView(GEOMETRY), ASPECT),
        ).toBeUndefined();
    });

    it("leaves room for the header strip on the edge the headers run along", () => {
        const view = BracketUtils.computeFamilyView(LAYOUT, GEOMETRY, undefined, 5);
        const top = Math.min(
            ...LAYOUT.placements
                .filter((placement) => BracketUtils.getIsInFamily(placement.id, undefined))
                .map((placement) => BracketUtils.computeInset(GEOMETRY, placement).top),
        );

        expect(view.y.start, "the margin and the strip both sit above the top row").toBe(top - 5 - 20);
    });
});
