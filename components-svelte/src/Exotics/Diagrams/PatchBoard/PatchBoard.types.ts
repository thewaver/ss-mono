import type { Snippet } from "svelte";

import type {
    InteractionFlags,
    PatchBoardAnnouncements,
    PatchBoardCableDefs,
    PatchBoardLink,
    PatchBoardNode,
    PatchBoardNodeFlags,
    PatchBoardOrientation,
    PatchBoardSnapFn,
    PatchBoardSocket,
    PatchBoardSocketFlags,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

export type PatchBoardProps<T> = {
    /** Identifies the board, so two boards can tell their own sockets from each other's. */
    groupId: string;
    /** Names the board for assistive technology. */
    ariaLabel: string;
    /**
     * Everything the board says aloud while a node or a cable is moved, and every socket name, key hint and place
     * name those announcements are built from. There is no default: every word a reader hears comes from here.
     */
    announcements: PatchBoardAnnouncements;
    /**
     * The board's height as a fraction of its width. The board takes whatever width its container gives it and every
     * spot, size and distance on it is a fraction of that width, so this is the one number that says what shape it
     * is. Zooming is the consumer scaling the board, or giving it more width.
     */
    heightRatio: number;
    /** Which way the board runs, which decides where a node's inputs and outputs sit. */
    orientation?: PatchBoardOrientation;
    /** How large one socket is drawn, as a fraction of the board's width. */
    socketSize?: number;
    /**
     * How close a cable end has to get to a socket before it counts as landing on it, as a fraction of the board's
     * width.
     */
    socketReach?: number;
    /**
     * How far one press of an arrow key moves a node, as a fraction of the board's width, for moving without a
     * pointer. With `computeSnapSpot` given it is how finely the board looks for the next snapped spot.
     */
    stepSize?: number;
    /**
     * Pulls a spot a node is moved to onto one the board allows, such as the nearest point of a grid. It is applied
     * while the node is carried, so the node moves in snapped steps under the pointer, and to every keyboard move,
     * where an arrow key goes to the next snapped spot in its direction rather than by `stepSize`. The node is still
     * held inside the board afterwards. Left out, a node goes anywhere.
     */
    computeSnapSpot?: PatchBoardSnapFn;
    /** Turns the board off, so nothing on it responds. */
    isDisabled?: boolean;
    /** Freezes the wiring as it stands: cables still show, but none can be made, moved or pulled out. */
    isLocked?: boolean;
    /**
     * The nodes and where they sit. Bind it with `bind:nodes`: it is the only thing that moves them, and the board
     * writes it when a node is moved.
     */
    nodes: PatchBoardNode<T>[];
    /**
     * The cables currently wired. Bind it with `bind:links`: it is the only thing that adds or removes one, and the
     * board writes it when a cable is made or pulled out.
     */
    links: PatchBoardLink[];
    /** The key one node is told apart by, which is what lets a node keep its cables as it moves. */
    computeNodeKey: (value: T) => string;
    /** Names one node for assistive technology. */
    computeNodeLabel: (value: T) => string;
    /**
     * Whether a cable between two given sockets is allowed, so a board can refuse a connection that makes no sense.
     * Asked only after the board's own refusals have passed. `PatchBoardUtils.getClosesLoop` answers the common rule
     * that a signal may not find its way back to where it came from.
     */
    computeCanLink?: (link: PatchBoardLink) => boolean;
    /** Draws one node. */
    renderNode: Snippet<[node: PatchBoardNode<T>, flags: InteractionFlags<PatchBoardNodeFlags>]>;
    /** Draws one socket. */
    renderSocket?: Snippet<[socket: PatchBoardSocket, flags: InteractionFlags<PatchBoardSocketFlags>]>;
    /** Draws one cable, and is told where both ends are. */
    renderCable: Snippet<[defs: PatchBoardCableDefs]>;
    /** Runs when a cable is made. */
    onLink?: (link: PatchBoardLink) => void;
    /** Runs when a cable is pulled out. */
    onUnlink?: (link: PatchBoardLink) => void;
    /** Runs when a node is moved. */
    onMove?: (nodeKey: string, spot: Point2d) => void;
};
