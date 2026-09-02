import { describe, expect, it } from "vitest";

import type { BracketConnectorDefs } from "../../../Exotics/Bracket/Bracket.types";
import { BracketConnectorPaths } from "./BracketConnectorPaths.const";

const across: BracketConnectorDefs = {
    id: "board-0-0.0",
    parentId: "0",
    childId: "0.0",
    orientation: "horizontal",
    from: { x: 200, y: 100 },
    to: { x: 100, y: 40 },
};

const down: BracketConnectorDefs = {
    id: "board-0-0.0",
    parentId: "0",
    childId: "0.0",
    orientation: "vertical",
    from: { x: 100, y: 200 },
    to: { x: 40, y: 300 },
};

const level: BracketConnectorDefs = { ...across, to: { x: 100, y: 100 } };

const numbersIn = (path: string) => path.match(/-?[\d.]+/g)?.map(Number) ?? [];

describe("getSpine", () => {
    it("puts the bend halfway between the two edges, which is the middle of the gap", () => {
        expect(BracketConnectorPaths.getSpine(across)).toBe(150);
    });

    it("measures along whichever axis the layers run", () => {
        expect(BracketConnectorPaths.getSpine(down), "vertically the layers run down the page").toBe(250);
    });
});

describe("elbow", () => {
    it("leaves the parent's edge, turns once at the spine, and arrives at the child's", () => {
        expect(BracketConnectorPaths.elbow(across, 0)).toBe("M 200 100 L 150 100 L 150 40 L 100 40");
    });

    it("writes the same shape with the axes swapped when the board is upright", () => {
        expect(BracketConnectorPaths.elbow(down, 0)).toBe("M 100 200 L 100 250 L 40 250 L 40 300");
    });

    it("starts and ends exactly on the two edges it was given, so it never enters a node", () => {
        const points = numbersIn(BracketConnectorPaths.elbow(across, 0));

        expect([points[0], points[1]], "the first point is the parent's edge").toEqual([200, 100]);
        expect(points.slice(-2), "and the last is the child's").toEqual([100, 40]);
    });
});

describe("roundedElbow", () => {
    it("still starts and ends on the two edges", () => {
        const points = numbersIn(BracketConnectorPaths.roundedElbow(across, 12));

        expect([points[0], points[1]]).toEqual([200, 100]);
        expect(points.slice(-2)).toEqual([100, 40]);
    });

    it("takes the corners off, so the path is curves rather than corners", () => {
        expect(BracketConnectorPaths.roundedElbow(across, 12)).toContain("Q");
        expect(BracketConnectorPaths.elbow(across, 12), "which the flat one never is").not.toContain("Q");
    });

    it("never bends further than the room it has, so a tight corner does not overshoot", () => {
        const tight = BracketConnectorPaths.roundedElbow(across, 500);
        const points = numbersIn(tight);

        expect(Math.min(...points.filter((_unused, index) => index % 2 === 0)), "nothing reaches past the child").toBe(
            100,
        );
        expect(Math.max(...points.filter((_unused, index) => index % 2 === 0)), "or past the parent").toBe(200);
    });

    it("falls back to a straight elbow when the two ends are already level", () => {
        expect(BracketConnectorPaths.roundedElbow(level, 12)).toBe(BracketConnectorPaths.elbow(level, 12));
    });
});

describe("curve", () => {
    it("bends the whole way rather than turning, and still meets both edges", () => {
        const path = BracketConnectorPaths.curve(across, 0);
        const points = numbersIn(path);

        expect(path).toContain("C");
        expect([points[0], points[1]]).toEqual([200, 100]);
        expect(points.slice(-2)).toEqual([100, 40]);
    });
});
