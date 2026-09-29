import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { CarrierAnnouncements, CarrierZone } from "../../Abstracts/Carrier/Carrier.types";

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
     * position as numbers would mean nothing read aloud, so the board says which third of it the node is in.
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
    /** The consumer's own record for the node, handed back to every callback that names it. */
    value: T;
    /**
     * Where the node's top left corner sits, as fractions of the board's width on both axes — so `y: 0.5` is
     * half a width down, not half the height. Written in one unit, a node keeps its shape and its place when
     * the board is drawn wider or narrower.
     */
    spot: Point2d;
    /** How large the node is, as fractions of the board's width on both axes, the same unit as `spot`. */
    sizeShare: Size2d;
    /** The node's inputs and outputs, spread along the edges that `orientation` gives each kind. */
    sockets: PatchBoardSocket[];
    /** Turns the node off: it cannot be picked up, and none of its sockets take or give a cable. */
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
    sizeShare: Size2d;
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
    /** Tells one cable from another, stable for as long as the same two sockets are joined. */
    key: string;
    /**
     * Where the cable starts, as fractions of the board's width on both axes. The board's own drawing
     * surface is scaled to match, so a path written in these numbers lands on the sockets at any width.
     */
    from: Point2d;
    /** Where the cable ends, in the same unit as `from`. */
    to: Point2d;
    /** Which kind of socket the cable starts from, so the painter knows which way it leaves. */
    fromKind: PatchBoardSocketKind;
    /** Which way the board runs, so the painter knows whether to bow the cable sideways or up and down. */
    orientation: PatchBoardOrientation;
    /** Whether this is the cable still being carried rather than one already plugged in. */
    isPending: boolean;
    /** Whether the carried cable would be allowed where it is aimed. Always true for a plugged-in cable. */
    isAllowed: boolean;
};

export type PatchBoardSnapFn = (spot: Point2d) => Point2d;

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

export type PatchBoardPendingCable = {
    key: string;
    from: PatchBoardEnd;
    place: PatchBoardPlace;
    isAllowed: boolean;
};

export type PatchBoardDefs<T> = {
    getZone: () => CarrierZone;
    getGroupId: () => string;
    getLabel: () => string;
    getRootRef: () => HTMLElement | undefined;
    getIsDisabled: () => boolean;
    getIsLocked: () => boolean;
    getAnnouncements: () => PatchBoardAnnouncements;
    getHeightRatio: () => number;
    getSocketReach: () => number;
    getStepSize: () => number;
    getSnapSpot: () => PatchBoardSnapFn | undefined;
    getCanLink: () => ((link: PatchBoardLink) => boolean) | undefined;
    getNodes: () => PatchBoardNode<T>[];
    getLinks: () => PatchBoardLink[];
    getPlacements: () => PatchBoardPlacement[];
    getPlacedSocketByEndKey: () => Map<string, PatchBoardPlacedSocket>;
    computeNodeKey: (value: T) => string;
    computeNodeLabel: (value: T) => string;
    updateNodes: (update: (nodes: PatchBoardNode<T>[]) => PatchBoardNode<T>[]) => void;
    updateLinks: (update: (links: PatchBoardLink[]) => PatchBoardLink[]) => void;
    focusStop: (stopKey: string | undefined) => void;
    onLink?: (link: PatchBoardLink) => void;
    onUnlink?: (link: PatchBoardLink) => void;
    onMove?: (nodeKey: string, spot: Point2d) => void;
    batch?: (commit: () => void) => void;
};

export type PatchBoardHandle<T> = {
    zone: CarrierZone;
    getEndLabel: (end: PatchBoardEnd) => string;
    getIsEndAllowed: (fromEnd: PatchBoardEnd, toEnd: PatchBoardEnd) => boolean;
    handleNodePointerDown: (node: PatchBoardNode<T>, e: PointerEvent, currentTarget: EventTarget | null) => void;
    handleSocketPointerDown: (socket: PatchBoardPlacedSocket | undefined, e: PointerEvent) => void;
    handleNodeClick: (node: PatchBoardNode<T>, e: MouseEvent, currentTarget: EventTarget | null) => void;
    handleSocketClick: (socket: PatchBoardPlacedSocket | undefined, e: MouseEvent) => void;
    handleStopKeyDown: (
        stopKey: string,
        node: PatchBoardNode<T>,
        socket: PatchBoardPlacedSocket | undefined,
        e: KeyboardEvent,
    ) => void;
    handleRootClick: (e: MouseEvent) => void;
    observeClicks: (root: HTMLElement) => () => void;
    observeTapAim: () => () => void;
    cancel: () => void;
};
