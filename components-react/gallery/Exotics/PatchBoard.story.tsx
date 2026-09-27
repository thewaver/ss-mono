import { type ReactNode, useState } from "react";

import {
    type InteractionFlags,
    type PatchBoardAnnouncements,
    type PatchBoardCableDefs,
    type PatchBoardLink,
    type PatchBoardNode,
    type PatchBoardNodeFlags,
    type PatchBoardSnapFn,
    type PatchBoardSocketFlags,
    PatchBoardUtils,
} from "@thewaver/ss-components";

import { PatchBoard, type PatchBoardProps } from "../../src";

type Device = { id: string; name: string };

const BOARD_WIDTH = 460;
const HEIGHT_RATIO = 0.5;
const STANDING_HEIGHT_RATIO = 0.61;
const NODE_SIZE = { width: 0.225, height: 0.135 };
const RACK_NODE_SIZE = { width: 0.1875, height: 0.125 };
const GRID_COLUMNS = 32;
const GRID_CELL = 1 / GRID_COLUMNS;
const PAN_BOARD_WIDTH = 1120;
const PAN_HEIGHT_RATIO = 0.35;
const PAN_SCALE = BOARD_WIDTH / PAN_BOARD_WIDTH;
const PAN_NODE_SIZE = { width: 0.093, height: 0.055 };
const PAN_WINDOW_HEIGHT = 260;
const ZOOM_STEP = 0.25;
const MIN_BOW = 0.09;
const BOW_RATIO = 0.55;
const SOCKET_SIZE = 0.03;
const SOCKET_REACH = 0.06;
const STEP_SIZE = 0.02;

const ANNOUNCEMENTS: PatchBoardAnnouncements = {
    computePickedUp: (itemLabel, zoneLabel) => `${itemLabel} picked up from ${zoneLabel}.`,
    computePickedUpByKey: (itemLabel, zoneLabel, placeLabel, keyHint) =>
        `${itemLabel} picked up from ${zoneLabel}, ${placeLabel}. ${keyHint}`,
    computeAimed: (placeLabel, zoneLabel) => `${placeLabel} in ${zoneLabel}.`,
    computeZoneEntered: (zoneLabel, placeLabel) => `${zoneLabel}, ${placeLabel}.`,
    computeReturned: (itemLabel, zoneLabel) => `${itemLabel} returned to ${zoneLabel}.`,
    computeLeftInPlace: (itemLabel) => `${itemLabel} left where it was.`,
    computeRefused: (itemLabel, toZoneLabel, fromZoneLabel) =>
        `${itemLabel} does not fit in ${toZoneLabel}, returned to ${fromZoneLabel}.`,
    computeDropped: (itemLabel, zoneLabel, placeLabel) => `${itemLabel} dropped in ${zoneLabel}, ${placeLabel}.`,
    nodeRestingKeyHint: "Press Enter to pick this up and move it.",
    socketRestingKeyHint: "Press Enter to pick a cable up from this socket.",
    nodeKeyHint: "Arrow keys move it, Enter drops, Escape cancels.",
    plugKeyHint: "Arrow keys choose a socket, Enter connects, Escape cancels.",
    computeRegionLabel: (region) => `${region.vertical} ${region.horizontal}`,
    offBoardPlaceLabel: "off the board",
    noSocketPlaceLabel: "no socket",
    computeSocketPlaceLabel: (endLabel, isRefused) => `${endLabel}${isRefused ? ", cannot connect" : ""}`,
    computeEndLabel: (nodeLabel, socketLabel) => `${nodeLabel} ${socketLabel}`,
    computeCableLabel: (endLabel) => `cable from ${endLabel}`,
    computeUnplugged: (endLabel, count) => `${count > 1 ? `${count} cables` : "Cable"} unplugged from ${endLabel}.`,
    computeSocketLabel: (endLabel, kind, isConnected) =>
        `${endLabel}, ${kind === "in" ? "input" : "output"}${isConnected ? ", connected" : ""}`,
};

const device = (
    id: string,
    name: string,
    x: number,
    y: number,
    sockets: PatchBoardNode<Device>["sockets"],
    sizeShare = NODE_SIZE,
): PatchBoardNode<Device> => ({ value: { id, name }, spot: { x, y }, sizeShare, sockets });

const link = (fromNode: string, fromSocket: string, toNode: string, toSocket: string): PatchBoardLink => ({
    from: { nodeKey: fromNode, socketId: fromSocket },
    to: { nodeKey: toNode, socketId: toSocket },
});

const CHAIN_NODES = [
    device("clock", "Clock", 0.025, 0.045, [{ id: "tick", kind: "out", label: "tick" }]),
    device("gate", "Gate", 0.385, 0.26, [
        { id: "in", kind: "in", label: "in" },
        { id: "open", kind: "in", label: "open", isDisabled: true },
        { id: "out", kind: "out", label: "out" },
    ]),
    device("lamp", "Lamp", 0.73, 0.05, [{ id: "sig", kind: "in", label: "signal" }]),
];

const CHAIN_LINKS = [link("clock", "tick", "gate", "in")];

const MIXER_NODES = [
    device("drums", "Drums", 0.03, 0.02, [{ id: "out", kind: "out", label: "out" }]),
    device("bass", "Bass", 0.387, 0.02, [{ id: "out", kind: "out", label: "out" }]),
    device("vocal", "Vocal", 0.745, 0.02, [{ id: "out", kind: "out", label: "out" }]),
    device("mixer", "Mixer", 0.387, 0.235, [
        { id: "one", kind: "in", label: "channel one" },
        { id: "two", kind: "in", label: "channel two" },
        { id: "three", kind: "in", label: "channel three" },
        { id: "sum", kind: "out", label: "sum" },
    ]),
    device("amp", "Amp", 0.387, 0.448, [{ id: "in", kind: "in", label: "in" }]),
];

const MIXER_LINKS = [link("drums", "out", "mixer", "one"), link("mixer", "sum", "amp", "in")];

const RACK_NODES = [
    device("input", "Input", 0.03125, 0.1875, [{ id: "out", kind: "out", label: "out" }], RACK_NODE_SIZE),
    device(
        "filter",
        "Filter",
        0.28125,
        0.03125,
        [
            { id: "in", kind: "in", label: "in" },
            { id: "out", kind: "out", label: "out" },
        ],
        RACK_NODE_SIZE,
    ),
    device(
        "delay",
        "Delay",
        0.28125,
        0.34375,
        [
            { id: "in", kind: "in", label: "in" },
            { id: "feedback", kind: "in", label: "feedback" },
            { id: "out", kind: "out", label: "out" },
        ],
        RACK_NODE_SIZE,
    ),
    device(
        "reverb",
        "Reverb",
        0.53125,
        0.1875,
        [
            { id: "in", kind: "in", label: "in" },
            { id: "out", kind: "out", label: "out" },
        ],
        RACK_NODE_SIZE,
    ),
    device("output", "Output", 0.78125, 0.1875, [{ id: "in", kind: "in", label: "in" }], RACK_NODE_SIZE),
];

const RACK_LINKS = [
    link("input", "out", "filter", "in"),
    link("filter", "out", "delay", "in"),
    link("delay", "out", "reverb", "in"),
];

const THROUGH = (id: string, name: string, x: number, y: number) =>
    device(
        id,
        name,
        x,
        y,
        [
            { id: "in", kind: "in", label: "in" },
            { id: "out", kind: "out", label: "out" },
        ],
        PAN_NODE_SIZE,
    );

const PAN_NODES = [
    device("mic", "Mic", 0.02, 0.03, [{ id: "out", kind: "out", label: "out" }], PAN_NODE_SIZE),
    THROUGH("preamp", "Preamp", 0.2, 0.17),
    THROUGH("eq", "EQ", 0.38, 0.03),
    THROUGH("compressor", "Compressor", 0.56, 0.17),
    device("recorder", "Recorder", 0.74, 0.03, [{ id: "in", kind: "in", label: "in" }], PAN_NODE_SIZE),
    device("speaker", "Speaker", 0.88, 0.24, [{ id: "in", kind: "in", label: "in" }], PAN_NODE_SIZE),
];

const PAN_LINKS = [
    link("mic", "out", "preamp", "in"),
    link("preamp", "out", "eq", "in"),
    link("eq", "out", "compressor", "in"),
];

const toGrid = (value: number) => Math.round(value * GRID_COLUMNS) * GRID_CELL;

const snapToGrid: PatchBoardSnapFn = (spot) => ({ x: toGrid(spot.x), y: toGrid(spot.y) });

const linkWords = (entry: PatchBoardLink) =>
    `${entry.from.nodeKey} ${entry.from.socketId} to ${entry.to.nodeKey} ${entry.to.socketId}`;

const NodeBody = ({ node, flags }: { node: PatchBoardNode<Device>; flags: InteractionFlags<PatchBoardNodeFlags> }) => (
    <div
        style={{
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #666",
            borderRadius: 4,
            background: flags.isCarried ? "#eef" : "#fff",
            fontSize: 12,
        }}
    >
        {node.value.name}
    </div>
);

const SocketBody = ({ flags }: { flags: InteractionFlags<PatchBoardSocketFlags> }) => (
    <div
        data-socket-kind={flags.kind}
        style={{
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            borderRadius: "50%",
            border: "2px solid #36c",
            background: flags.isTaken ? "#36c" : "#fff",
        }}
    />
);

const Cable = ({ defs }: { defs: PatchBoardCableDefs }) => {
    const isVertical = defs.orientation === "vertical";
    const span = isVertical ? defs.to.y - defs.from.y : defs.to.x - defs.from.x;
    const bow = Math.max(MIN_BOW, Math.abs(span) * BOW_RATIO);
    const lead = defs.fromKind === "out" ? bow : -bow;
    const first = isVertical ? `${defs.from.x} ${defs.from.y + lead}` : `${defs.from.x + lead} ${defs.from.y}`;
    const second = isVertical ? `${defs.to.x} ${defs.to.y - lead}` : `${defs.to.x - lead} ${defs.to.y}`;

    return (
        <path
            d={`M ${defs.from.x} ${defs.from.y} C ${first}, ${second}, ${defs.to.x} ${defs.to.y}`}
            fill="none"
            stroke={defs.isPending ? (defs.isAllowed ? "#c80" : "#c00") : "#36c"}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
        />
    );
};

type BoardProps = Partial<PatchBoardProps<Device>> & {
    scope: string;
    ariaLabel: string;
    initialNodes: PatchBoardNode<Device>[];
    initialLinks: PatchBoardLink[];
    width?: number;
    wrap?: (board: ReactNode) => ReactNode;
};

const Board = ({ scope, initialNodes, initialLinks, width = BOARD_WIDTH, wrap, ...rest }: BoardProps) => {
    const ownNodesState = useState(initialNodes);
    const ownLinksState = useState(initialLinks);
    const nodesState = rest.nodesState ?? ownNodesState;
    const linksState = rest.linksState ?? ownLinksState;
    const [action, setAction] = useState("nothing yet");

    const board = (
        <div style={{ width }}>
            <PatchBoard<Device>
                groupId={scope}
                announcements={ANNOUNCEMENTS}
                heightRatio={HEIGHT_RATIO}
                computeNodeKey={(value) => value.id}
                computeNodeLabel={(value) => value.name}
                renderNode={(node, flags) => <NodeBody node={node} flags={flags} />}
                renderSocket={(_socket, flags) => <SocketBody flags={flags} />}
                renderCable={(defs) => <Cable defs={defs} />}
                onLink={(entry) => setAction(`connected ${linkWords(entry)}`)}
                onUnlink={(entry) => setAction(`unplugged ${linkWords(entry)}`)}
                onMove={(nodeKey) => setAction(`moved ${nodeKey}`)}
                {...rest}
                nodesState={nodesState}
                linksState={linksState}
            />
        </div>
    );

    return (
        <div data-testid={scope} style={{ padding: 10 }}>
            {wrap ? wrap(board) : board}
            <output data-readout="board">{`${linksState[0].length} cables, last: ${action}`}</output>
        </div>
    );
};

export const Default = () => (
    <>
        <Board scope="chain" ariaLabel="Signal chain" initialNodes={CHAIN_NODES} initialLinks={CHAIN_LINKS} />
        <Board
            scope="mixer"
            ariaLabel="Mixing desk"
            heightRatio={STANDING_HEIGHT_RATIO}
            orientation="vertical"
            initialNodes={MIXER_NODES}
            initialLinks={MIXER_LINKS}
            computeCanLink={(entry) => entry.to.nodeKey !== "amp" || entry.from.nodeKey === "mixer"}
        />
    </>
);

export const Rack = () => {
    const linksState = useState(RACK_LINKS);
    const nodesState = useState(RACK_NODES);

    return (
        <Board
            scope="rack"
            ariaLabel="Effects rack"
            initialNodes={RACK_NODES}
            initialLinks={RACK_LINKS}
            nodesState={nodesState}
            linksState={linksState}
            computeSnapSpot={snapToGrid}
            computeCanLink={(entry) => !PatchBoardUtils.getClosesLoop(linksState[0], entry)}
        />
    );
};

export const Disabled = () => (
    <Board
        scope="disabled"
        ariaLabel="Disabled chain"
        initialNodes={CHAIN_NODES}
        initialLinks={CHAIN_LINKS}
        isDisabled={true}
    />
);

export const Locked = () => (
    <Board
        scope="locked"
        ariaLabel="Locked chain"
        initialNodes={CHAIN_NODES}
        initialLinks={CHAIN_LINKS}
        isLocked={true}
    />
);

export const Zoom = () => {
    const [zoom, setZoom] = useState(1);

    return (
        <>
            <button id="patchBoardZoomIn" onClick={() => setZoom((value) => value + ZOOM_STEP)}>
                Zoom in
            </button>
            <Board
                scope="zoom"
                ariaLabel="Zoomed chain"
                initialNodes={CHAIN_NODES}
                initialLinks={CHAIN_LINKS}
                wrap={(board) => (
                    <div style={{ width: BOARD_WIDTH, height: BOARD_WIDTH * HEIGHT_RATIO, overflow: "auto" }}>
                        <div style={{ width: BOARD_WIDTH, transformOrigin: "0 0", transform: `scale(${zoom})` }}>
                            {board}
                        </div>
                    </div>
                )}
            />
        </>
    );
};

export const Pan = () => (
    <Board
        scope="pan"
        ariaLabel="Recording chain"
        heightRatio={PAN_HEIGHT_RATIO}
        socketSize={SOCKET_SIZE * PAN_SCALE}
        socketReach={SOCKET_REACH * PAN_SCALE}
        stepSize={STEP_SIZE * PAN_SCALE}
        initialNodes={PAN_NODES}
        initialLinks={PAN_LINKS}
        width={PAN_BOARD_WIDTH}
        wrap={(board) => (
            <div data-pan-window style={{ width: BOARD_WIDTH, height: PAN_WINDOW_HEIGHT, overflow: "auto" }}>
                {board}
            </div>
        )}
    />
);
