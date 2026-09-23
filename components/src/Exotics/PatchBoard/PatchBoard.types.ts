import type { Accessor, JSX } from "solid-js";

import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { CarrierAnnouncements } from "../../Abstracts/Carrier/Carrier.types";
import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type PatchBoardOrientation = "horizontal" | "vertical";

export type PatchBoardSocketKind = "in" | "out";

export type PatchBoardVerticalBand = "top" | "middle" | "bottom";

export type PatchBoardHorizontalBand = "left" | "center" | "right";

export type PatchBoardRegion = {
    /** Which third of the board's height the node's middle sits in. */
    vertical: PatchBoardVerticalBand;
    /** Which third of the board's width the node's middle sits in. */
    horizontal: PatchBoardHorizontalBand;
};

export type PatchBoardAnnouncements = CarrierAnnouncements & {
    /** Describes every node while nothing is picked up, telling a keyboard user that Enter picks it up. */
    nodeRestingKeyHint: string;
    /** Describes every socket while nothing is picked up, telling a keyboard user that Enter takes a cable from it. */
    socketRestingKeyHint: string;
    /** Tells a keyboard user which keys move, drop and cancel a node that has been picked up. */
    nodeKeyHint: string;
    /** Tells a keyboard user which keys choose a socket, connect and cancel a cable that has been picked up. */
    plugKeyHint: string;
    /**
     * Names where a carried node would land, which is what the move and drop announcements say it is at. A
     * position in pixels would mean nothing read aloud, so the board says which third of it the node is in.
     */
    computeRegionLabel: (region: PatchBoardRegion) => string;
    /** Names the place a carried node is at when it is somehow not on the board at all. */
    offBoardPlaceLabel: string;
    /** Names the place a carried cable end is at when it is not over any socket. */
    noSocketPlaceLabel: string;
    /**
     * Names the socket a carried cable end is over.
     *
     * @param endLabel The socket's name, from {@link PatchBoardAnnouncements.computeEndLabel}.
     * @param isRefused Whether the cable would not be allowed to connect there, so a reader is told before
     * dropping it.
     */
    computeSocketPlaceLabel: (endLabel: string, isRefused: boolean) => string;
    /**
     * Names one socket by the node it is on, which every other socket announcement is built from.
     *
     * @param nodeLabel The node's name, from `computeNodeLabel`, or its key when the node is no longer on the board.
     * @param socketLabel The socket's own label, or its id when the node does not list it.
     */
    computeEndLabel: (nodeLabel: string, socketLabel: string) => string;
    /**
     * Names a cable while it is being carried, which is the item label the pick-up and drop announcements use.
     *
     * @param endLabel The socket it was picked up from.
     */
    computeCableLabel: (endLabel: string) => string;
    /**
     * What is said when the cables in one socket are pulled out.
     *
     * @param endLabel The socket they were pulled from.
     * @param count How many cables came out, at least one.
     */
    computeUnplugged: (endLabel: string, count: number) => string;
    /**
     * Names a socket's own control, which is what a reader hears as it takes focus.
     *
     * @param endLabel The socket's name.
     * @param kind Whether it is an input or an output.
     * @param isConnected Whether a cable is plugged into it.
     */
    computeSocketLabel: (endLabel: string, kind: PatchBoardSocketKind, isConnected: boolean) => string;
};

export type PatchBoardSocket = {
    id: string;
    kind: PatchBoardSocketKind;
    label: string;
    isDisabled?: boolean;
};

export type PatchBoardNode<T> = {
    value: T;
    spot: Point2d;
    size: Size2d;
    sockets: PatchBoardSocket[];
    isDisabled?: boolean;
};

export type PatchBoardEnd = {
    nodeKey: string;
    socketId: string;
};

export type PatchBoardLink = {
    from: PatchBoardEnd;
    to: PatchBoardEnd;
};

export type PatchBoardPlacement = {
    key: string;
    spot: Point2d;
    size: Size2d;
    sockets: PatchBoardSocket[];
    isDisabled: boolean;
};

export type PatchBoardPlacedSocket = {
    end: PatchBoardEnd;
    kind: PatchBoardSocketKind;
    label: string;
    point: Point2d;
    isDisabled: boolean;
};

export type PatchBoardSpotPlace = Point2d & {
    kind: "spot";
};

export type PatchBoardSocketPlace = PatchBoardEnd & {
    kind: "socket";
};

export type PatchBoardFreePlace = Point2d & {
    kind: "free";
};

export type PatchBoardPlace = PatchBoardSpotPlace | PatchBoardSocketPlace | PatchBoardFreePlace;

export type PatchBoardCarry<T> =
    | {
          kind: "node";
          node: PatchBoardNode<T>;
      }
    | {
          kind: "plug";
          from: PatchBoardEnd;
      };

export type PatchBoardCableDefs = {
    key: string;
    from: Point2d;
    to: Point2d;
    fromKind: PatchBoardSocketKind;
    orientation: PatchBoardOrientation;
    isPending: boolean;
    isAllowed: boolean;
};

export type PatchBoardNodeFlags = {
    isCarried: boolean;
};

export type PatchBoardSocketFlags = {
    kind: PatchBoardSocketKind;
    isTaken: boolean;
    isFull: boolean;
    isSource: boolean;
    isAimed: boolean;
    isAllowed: boolean;
};

export type PatchBoardProps<T> = AccessorProps<{
    /** Identifies the board, so two boards can tell their own sockets from each other's. */
    groupId: string;
    /** Names the board for assistive technology. */
    ariaLabel: string;
    /**
     * Everything the board says aloud while a node or a cable is moved, and every socket name, key hint and place
     * name those announcements are built from. There is no default: every word a reader hears comes from here.
     */
    announcements: PatchBoardAnnouncements;
    /** How large the board is. */
    size: Size2d;
    /** Which way the board runs, which decides where a node's inputs and outputs sit. */
    orientation?: PatchBoardOrientation;
    /** How large one socket is drawn. */
    socketSize?: number;
    /** How close a cable end has to get to a socket before it counts as landing on it. */
    socketReach?: number;
    /** How far one press of an arrow key moves a node, for moving without a pointer. */
    stepSize?: number;
    /** Turns the board off, so nothing on it responds. */
    isDisabled?: boolean;
    /** Freezes the wiring as it stands: cables still show, but none can be made, moved or pulled out. */
    isLocked?: boolean;
    /** The cables currently wired. It is the only thing that adds or removes one. */
    linksSignal: SignalSource<PatchBoardLink[]>;
    /** Whether a cable between two given sockets is allowed, so a board can refuse a connection that makes no sense. */
    computeCanLink?: (link: PatchBoardLink) => boolean;
    /** Draws one socket. */
    renderSocket?: (
        getSocket: Accessor<PatchBoardSocket>,
        getFlags: () => InteractionFlags<PatchBoardSocketFlags>,
    ) => JSX.Element;
    /** Draws one cable, and is told where both ends are. */
    renderCable: (getDefs: Accessor<PatchBoardCableDefs>) => JSX.Element;
    /** Runs when a cable is made. */
    onLink?: (link: PatchBoardLink) => void;
    /** Runs when a cable is pulled out. */
    onUnlink?: (link: PatchBoardLink) => void;
    /** Runs when a node is moved. */
    onMove?: (nodeKey: string, spot: Point2d) => void;
}> & {
    /** The nodes and where they sit. It is the only thing that moves them. */
    nodesSignal: SignalSource<PatchBoardNode<T>[]>;
    /** The key one node is told apart by, which is what lets a node keep its cables as it moves. */
    computeNodeKey: (value: T) => string;
    /** Names one node for assistive technology. */
    computeNodeLabel: (value: T) => string;
    /** Draws one node. */
    renderNode: (
        getNode: Accessor<PatchBoardNode<T>>,
        getFlags: () => InteractionFlags<PatchBoardNodeFlags>,
    ) => JSX.Element;
};
