import { describe, expect, it } from "vitest";

import type { PatchBoardLink, PatchBoardPlacement, PatchBoardSocket } from "./PatchBoard.types";
import { PatchBoardUtils } from "./PatchBoard.utils";

const socket = (id: string, kind: PatchBoardSocket["kind"], isDisabled = false): PatchBoardSocket => ({
    id,
    kind,
    label: id,
    isDisabled,
});

const placement = (
    key: string,
    x: number,
    y: number,
    sockets: PatchBoardSocket[],
    isDisabled = false,
): PatchBoardPlacement => ({
    key,
    spot: { x, y },
    size: { width: 100, height: 60 },
    sockets,
    isDisabled,
});

const CLOCK = placement("clock", 0, 0, [socket("tick", "out")]);
const GATE = placement("gate", 200, 0, [socket("in", "in"), socket("open", "in"), socket("out", "out")]);
const LAMP = placement("lamp", 400, 0, [socket("sig", "in")]);

const BOARD = [CLOCK, GATE, LAMP];

const PLACED = PatchBoardUtils.getPlacedSockets(BOARD);

const find = (nodeKey: string, socketId: string) => PatchBoardUtils.findSocket(PLACED, { nodeKey, socketId })!;

const CLOCK_TICK = find("clock", "tick");
const GATE_IN = find("gate", "in");
const GATE_OPEN = find("gate", "open");
const GATE_OUT = find("gate", "out");
const LAMP_SIG = find("lamp", "sig");

const LINK: PatchBoardLink = { from: CLOCK_TICK.end, to: GATE_IN.end };

describe("getSocketPoint", () => {
    it("puts an output on the right edge and an input on the left", () => {
        expect(CLOCK_TICK.point.x).toBe(100);
        expect(GATE_IN.point.x).toBe(200);
    });

    it("spreads the sockets of one kind down the edge without counting the other kind", () => {
        expect(GATE_IN.point.y).toBe(20);
        expect(GATE_OPEN.point.y).toBe(40);
        expect(GATE_OUT.point.y).toBe(30);
    });

    it("moves with the node, which is what keeps a cable attached while a box is dragged", () => {
        const moved = PatchBoardUtils.getPlacedSockets([{ ...CLOCK, spot: { x: 30, y: 45 } }]);

        expect(moved[0].point).toEqual({ x: 130, y: 75 });
    });

    it("turns the edges through a right angle when the board is vertical, inputs on top and outputs below", () => {
        const placed = PatchBoardUtils.getPlacedSockets([GATE], "vertical");
        const point = (socketId: string) => PatchBoardUtils.findSocket(placed, { nodeKey: "gate", socketId })!.point;

        expect(point("in").y, "an input sits on the top edge").toBe(0);
        expect(point("open").y, "and so does the one beside it").toBe(0);
        expect(point("out").y, "while an output sits on the bottom one").toBe(60);

        expect(point("in").x, "the first input a third of the way across").toBeCloseTo(233.33);
        expect(point("open").x, "the second two thirds across the same edge").toBeCloseTo(266.67);
        expect(point("out").x, "and the only output in the middle of its own").toBe(250);
    });

    it("spreads each kind along its own edge in both orientations, so neither counts the other", () => {
        const horizontal = PatchBoardUtils.getPlacedSockets([GATE]);
        const vertical = PatchBoardUtils.getPlacedSockets([GATE], "vertical");

        expect(
            horizontal.map((socket) => socket.point.y),
            "down the sides when it lies across",
        ).toEqual([20, 40, 30]);
        expect(
            vertical.map((socket) => Math.round(socket.point.x)),
            "and across the ends when it stands up",
        ).toEqual([233, 267, 250]);
    });
});

describe("getIsPairAllowed", () => {
    it("joins an output to an input", () => {
        expect(PatchBoardUtils.getIsPairAllowed(CLOCK_TICK, GATE_IN, [])).toBe(true);
    });

    it("joins them the other way round too, since the cable knows which end is which", () => {
        expect(PatchBoardUtils.getIsPairAllowed(GATE_IN, CLOCK_TICK, [])).toBe(true);
        expect(PatchBoardUtils.getLink(GATE_IN, CLOCK_TICK)).toEqual(LINK);
    });

    it("refuses two sockets of the same kind", () => {
        expect(PatchBoardUtils.getIsPairAllowed(CLOCK_TICK, GATE_OUT, [])).toBe(false);
    });

    it("refuses a node wired to itself", () => {
        expect(PatchBoardUtils.getIsPairAllowed(GATE_OUT, GATE_IN, [])).toBe(false);
    });

    it("refuses an input that already has a cable, while the output it came from can feed another", () => {
        expect(PatchBoardUtils.getIsPairAllowed(CLOCK_TICK, GATE_IN, [LINK])).toBe(false);
        expect(PatchBoardUtils.getIsPairAllowed(CLOCK_TICK, LAMP_SIG, [LINK])).toBe(true);
    });

    it("refuses a disabled socket", () => {
        const off = PatchBoardUtils.getPlacedSockets([placement("off", 0, 0, [socket("in", "in", true)])]);

        expect(PatchBoardUtils.getIsPairAllowed(CLOCK_TICK, off[0], [])).toBe(false);
    });

    it("refuses every socket on a disabled node", () => {
        const off = PatchBoardUtils.getPlacedSockets([placement("off", 0, 0, [socket("in", "in")], true)]);

        expect(PatchBoardUtils.getIsPairAllowed(CLOCK_TICK, off[0], [])).toBe(false);
    });
});

describe("getNearestSocket", () => {
    it("takes the closest socket within reach", () => {
        expect(PatchBoardUtils.getNearestSocket(PLACED, { x: 205, y: 22 }, 28)?.end).toEqual(GATE_IN.end);
    });

    it("answers with nothing when the point is out in the open", () => {
        expect(PatchBoardUtils.getNearestSocket(PLACED, { x: 160, y: 200 }, 28)).toBeUndefined();
    });
});

describe("getClampedSpot", () => {
    it("keeps a node inside the board", () => {
        expect(
            PatchBoardUtils.getClampedSpot(
                { x: -40, y: 500 },
                { width: 100, height: 60 },
                {
                    width: 400,
                    height: 300,
                },
            ),
        ).toEqual({ x: 0, y: 240 });
    });

    it("leaves a node alone when it already fits", () => {
        expect(
            PatchBoardUtils.getClampedSpot({ x: 20, y: 30 }, { width: 100, height: 60 }, { width: 400, height: 300 }),
        ).toEqual({ x: 20, y: 30 });
    });
});

describe("getStopKeys", () => {
    it("reads a node then its own sockets, in reading order down the board", () => {
        const stacked = [
            placement("lower", 0, 100, [socket("a", "in")]),
            placement("upper", 0, 0, [socket("b", "out")]),
        ];

        expect(PatchBoardUtils.getStopKeys(stacked)).toEqual(["upper", "upper/b", "lower", "lower/a"]);
    });
});

describe("getSteppedKey", () => {
    const KEYS = ["one", "two", "three"];

    it("steps to the neighbour", () => {
        expect(PatchBoardUtils.getSteppedKey(KEYS, "two", 1)).toBe("three");
    });

    it("stays put at the end rather than wrapping round", () => {
        expect(PatchBoardUtils.getSteppedKey(KEYS, "three", 1)).toBe("three");
        expect(PatchBoardUtils.getSteppedKey(KEYS, "one", -1)).toBe("one");
    });

    it("starts at the first when nothing is focused yet", () => {
        expect(PatchBoardUtils.getSteppedKey(KEYS, undefined, 1)).toBe("one");
    });
});

describe("getSteppedSocket", () => {
    it("wraps round the candidates, because a cable in hand has to be able to reach all of them", () => {
        const candidates = [GATE_IN, GATE_OPEN, LAMP_SIG];

        expect(PatchBoardUtils.getSteppedSocket(candidates, LAMP_SIG.end, 1)?.end).toEqual(GATE_IN.end);
        expect(PatchBoardUtils.getSteppedSocket(candidates, GATE_IN.end, -1)?.end).toEqual(LAMP_SIG.end);
    });

    it("starts at the first candidate when the cable is over open space", () => {
        expect(PatchBoardUtils.getSteppedSocket([GATE_IN, LAMP_SIG], undefined, 1)?.end).toEqual(GATE_IN.end);
    });
});

describe("getRegionLabel", () => {
    const BOUNDS = { width: 300, height: 300 };
    const SIZE = { width: 20, height: 20 };

    it("names the third of the board the node's middle sits in", () => {
        expect(PatchBoardUtils.getRegionLabel({ x: 0, y: 0 }, SIZE, BOUNDS)).toBe("top left");
        expect(PatchBoardUtils.getRegionLabel({ x: 140, y: 140 }, SIZE, BOUNDS)).toBe("middle centre");
        expect(PatchBoardUtils.getRegionLabel({ x: 280, y: 280 }, SIZE, BOUNDS)).toBe("bottom right");
    });

    it("stays inside the vocabulary when a node hangs off the edge", () => {
        expect(PatchBoardUtils.getRegionLabel({ x: -100, y: 400 }, SIZE, BOUNDS)).toBe("bottom left");
    });
});
