import type { PatchBoardLink, PatchBoardNode } from "@thewaver/ss-components";

import type { PatchDevice } from "./PatchBoardPage.types";

export const BOARD_SIZE = { width: 460, height: 230 };
export const STANDING_BOARD_SIZE = { width: 460, height: 280 };
export const NODE_SIZE = { width: 104, height: 62 };

export const CHAIN_NODES: PatchBoardNode<PatchDevice>[] = [
    {
        value: { id: "clock", name: "Clock", kind: "source" },
        spot: { x: 12, y: 20 },
        size: NODE_SIZE,
        sockets: [{ id: "tick", kind: "out", label: "tick" }],
    },
    {
        value: { id: "gate", name: "Gate", kind: "logic" },
        spot: { x: 178, y: 120 },
        size: NODE_SIZE,
        sockets: [
            { id: "in", kind: "in", label: "in" },
            { id: "open", kind: "in", label: "open", isDisabled: true },
            { id: "out", kind: "out", label: "out" },
        ],
    },
    {
        value: { id: "lamp", name: "Lamp", kind: "output" },
        spot: { x: 336, y: 24 },
        size: NODE_SIZE,
        sockets: [{ id: "sig", kind: "in", label: "signal" }],
    },
];

export const CHAIN_LINKS: PatchBoardLink[] = [
    { from: { nodeKey: "clock", socketId: "tick" }, to: { nodeKey: "gate", socketId: "in" } },
];

export const MIXER_NODES: PatchBoardNode<PatchDevice>[] = [
    {
        value: { id: "drums", name: "Drums", kind: "source" },
        spot: { x: 14, y: 10 },
        size: NODE_SIZE,
        sockets: [{ id: "out", kind: "out", label: "out" }],
    },
    {
        value: { id: "bass", name: "Bass", kind: "source" },
        spot: { x: 178, y: 10 },
        size: NODE_SIZE,
        sockets: [{ id: "out", kind: "out", label: "out" }],
    },
    {
        value: { id: "vocal", name: "Vocal", kind: "source" },
        spot: { x: 342, y: 10 },
        size: NODE_SIZE,
        sockets: [{ id: "out", kind: "out", label: "out" }],
    },
    {
        value: { id: "mixer", name: "Mixer", kind: "desk" },
        spot: { x: 178, y: 108 },
        size: NODE_SIZE,
        sockets: [
            { id: "one", kind: "in", label: "channel one" },
            { id: "two", kind: "in", label: "channel two" },
            { id: "three", kind: "in", label: "channel three" },
            { id: "sum", kind: "out", label: "sum" },
        ],
    },
    {
        value: { id: "amp", name: "Amp", kind: "output" },
        spot: { x: 178, y: 206 },
        size: NODE_SIZE,
        sockets: [{ id: "in", kind: "in", label: "in" }],
    },
];

export const MIXER_LINKS: PatchBoardLink[] = [
    { from: { nodeKey: "drums", socketId: "out" }, to: { nodeKey: "mixer", socketId: "one" } },
    { from: { nodeKey: "mixer", socketId: "sum" }, to: { nodeKey: "amp", socketId: "in" } },
];

export const AMP_NODE_KEY = "amp";
export const MIXER_NODE_KEY = "mixer";
