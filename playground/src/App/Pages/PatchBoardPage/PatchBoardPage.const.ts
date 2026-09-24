import type { PatchBoardLink, PatchBoardNode } from "@thewaver/ss-components";

import type { PatchDevice } from "./PatchBoardPage.types";

export const BOARD_WIDTH = 460;
export const BOARD_HEIGHT_RATIO = 0.5;
export const STANDING_BOARD_HEIGHT_RATIO = 0.61;
export const NODE_SIZE_SHARE = { width: 0.225, height: 0.135 };

export const CHAIN_NODES: PatchBoardNode<PatchDevice>[] = [
    {
        value: { id: "clock", name: "Clock", kind: "source" },
        spot: { x: 0.025, y: 0.045 },
        sizeShare: NODE_SIZE_SHARE,
        sockets: [{ id: "tick", kind: "out", label: "tick" }],
    },
    {
        value: { id: "gate", name: "Gate", kind: "logic" },
        spot: { x: 0.385, y: 0.26 },
        sizeShare: NODE_SIZE_SHARE,
        sockets: [
            { id: "in", kind: "in", label: "in" },
            { id: "open", kind: "in", label: "open", isDisabled: true },
            { id: "out", kind: "out", label: "out" },
        ],
    },
    {
        value: { id: "lamp", name: "Lamp", kind: "output" },
        spot: { x: 0.73, y: 0.05 },
        sizeShare: NODE_SIZE_SHARE,
        sockets: [{ id: "sig", kind: "in", label: "signal" }],
    },
];

export const CHAIN_LINKS: PatchBoardLink[] = [
    { from: { nodeKey: "clock", socketId: "tick" }, to: { nodeKey: "gate", socketId: "in" } },
];

export const MIXER_NODES: PatchBoardNode<PatchDevice>[] = [
    {
        value: { id: "drums", name: "Drums", kind: "source" },
        spot: { x: 0.03, y: 0.02 },
        sizeShare: NODE_SIZE_SHARE,
        sockets: [{ id: "out", kind: "out", label: "out" }],
    },
    {
        value: { id: "bass", name: "Bass", kind: "source" },
        spot: { x: 0.387, y: 0.02 },
        sizeShare: NODE_SIZE_SHARE,
        sockets: [{ id: "out", kind: "out", label: "out" }],
    },
    {
        value: { id: "vocal", name: "Vocal", kind: "source" },
        spot: { x: 0.745, y: 0.02 },
        sizeShare: NODE_SIZE_SHARE,
        sockets: [{ id: "out", kind: "out", label: "out" }],
    },
    {
        value: { id: "mixer", name: "Mixer", kind: "desk" },
        spot: { x: 0.387, y: 0.235 },
        sizeShare: NODE_SIZE_SHARE,
        sockets: [
            { id: "one", kind: "in", label: "channel one" },
            { id: "two", kind: "in", label: "channel two" },
            { id: "three", kind: "in", label: "channel three" },
            { id: "sum", kind: "out", label: "sum" },
        ],
    },
    {
        value: { id: "amp", name: "Amp", kind: "output" },
        spot: { x: 0.387, y: 0.448 },
        sizeShare: NODE_SIZE_SHARE,
        sockets: [{ id: "in", kind: "in", label: "in" }],
    },
];

export const MIXER_LINKS: PatchBoardLink[] = [
    { from: { nodeKey: "drums", socketId: "out" }, to: { nodeKey: "mixer", socketId: "one" } },
    { from: { nodeKey: "mixer", socketId: "sum" }, to: { nodeKey: "amp", socketId: "in" } },
];

export const AMP_NODE_KEY = "amp";
export const MIXER_NODE_KEY = "mixer";

export const RACK_NODE_SIZE_SHARE = { width: 0.1875, height: 0.125 };

export const RACK_NODES: PatchBoardNode<PatchDevice>[] = [
    {
        value: { id: "input", name: "Input", kind: "source" },
        spot: { x: 0.03125, y: 0.1875 },
        sizeShare: RACK_NODE_SIZE_SHARE,
        sockets: [{ id: "out", kind: "out", label: "out" }],
    },
    {
        value: { id: "filter", name: "Filter", kind: "effect" },
        spot: { x: 0.28125, y: 0.03125 },
        sizeShare: RACK_NODE_SIZE_SHARE,
        sockets: [
            { id: "in", kind: "in", label: "in" },
            { id: "out", kind: "out", label: "out" },
        ],
    },
    {
        value: { id: "delay", name: "Delay", kind: "effect" },
        spot: { x: 0.28125, y: 0.34375 },
        sizeShare: RACK_NODE_SIZE_SHARE,
        sockets: [
            { id: "in", kind: "in", label: "in" },
            { id: "feedback", kind: "in", label: "feedback" },
            { id: "out", kind: "out", label: "out" },
        ],
    },
    {
        value: { id: "reverb", name: "Reverb", kind: "effect" },
        spot: { x: 0.53125, y: 0.1875 },
        sizeShare: RACK_NODE_SIZE_SHARE,
        sockets: [
            { id: "in", kind: "in", label: "in" },
            { id: "out", kind: "out", label: "out" },
        ],
    },
    {
        value: { id: "output", name: "Output", kind: "output" },
        spot: { x: 0.78125, y: 0.1875 },
        sizeShare: RACK_NODE_SIZE_SHARE,
        sockets: [{ id: "in", kind: "in", label: "in" }],
    },
];

export const RACK_LINKS: PatchBoardLink[] = [
    { from: { nodeKey: "input", socketId: "out" }, to: { nodeKey: "filter", socketId: "in" } },
    { from: { nodeKey: "filter", socketId: "out" }, to: { nodeKey: "delay", socketId: "in" } },
    { from: { nodeKey: "delay", socketId: "out" }, to: { nodeKey: "reverb", socketId: "in" } },
];

export const PAN_BOARD_WIDTH = 1120;
export const PAN_BOARD_HEIGHT_RATIO = 0.35;
export const PAN_SCALE = BOARD_WIDTH / PAN_BOARD_WIDTH;
export const PAN_NODE_SIZE_SHARE = { width: 0.093, height: 0.055 };

export const PAN_NODES: PatchBoardNode<PatchDevice>[] = [
    {
        value: { id: "mic", name: "Mic", kind: "source" },
        spot: { x: 0.02, y: 0.03 },
        sizeShare: PAN_NODE_SIZE_SHARE,
        sockets: [{ id: "out", kind: "out", label: "out" }],
    },
    {
        value: { id: "preamp", name: "Preamp", kind: "gain" },
        spot: { x: 0.2, y: 0.17 },
        sizeShare: PAN_NODE_SIZE_SHARE,
        sockets: [
            { id: "in", kind: "in", label: "in" },
            { id: "out", kind: "out", label: "out" },
        ],
    },
    {
        value: { id: "eq", name: "EQ", kind: "tone" },
        spot: { x: 0.38, y: 0.03 },
        sizeShare: PAN_NODE_SIZE_SHARE,
        sockets: [
            { id: "in", kind: "in", label: "in" },
            { id: "out", kind: "out", label: "out" },
        ],
    },
    {
        value: { id: "compressor", name: "Compressor", kind: "dynamics" },
        spot: { x: 0.56, y: 0.17 },
        sizeShare: PAN_NODE_SIZE_SHARE,
        sockets: [
            { id: "in", kind: "in", label: "in" },
            { id: "out", kind: "out", label: "out" },
        ],
    },
    {
        value: { id: "recorder", name: "Recorder", kind: "output" },
        spot: { x: 0.74, y: 0.03 },
        sizeShare: PAN_NODE_SIZE_SHARE,
        sockets: [{ id: "in", kind: "in", label: "in" }],
    },
    {
        value: { id: "speaker", name: "Speaker", kind: "output" },
        spot: { x: 0.88, y: 0.24 },
        sizeShare: PAN_NODE_SIZE_SHARE,
        sockets: [{ id: "in", kind: "in", label: "in" }],
    },
];

export const PAN_LINKS: PatchBoardLink[] = [
    { from: { nodeKey: "mic", socketId: "out" }, to: { nodeKey: "preamp", socketId: "in" } },
    { from: { nodeKey: "preamp", socketId: "out" }, to: { nodeKey: "eq", socketId: "in" } },
    { from: { nodeKey: "eq", socketId: "out" }, to: { nodeKey: "compressor", socketId: "in" } },
];

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2;
export const ZOOM_STEP = 0.25;
export const STARTING_ZOOM = 1;
