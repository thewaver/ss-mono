import type { Accessor, JSX } from "solid-js";

import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type PatchBoardOrientation = "horizontal" | "vertical";

export type PatchBoardSocketKind = "in" | "out";

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
