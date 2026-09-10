import { MathUtils, type Point2d, type Size2d } from "@thewaver/ss-utils";

import type {
    PatchBoardEnd,
    PatchBoardLink,
    PatchBoardOrientation,
    PatchBoardPlacedSocket,
    PatchBoardPlacement,
    PatchBoardSocket,
} from "./PatchBoard.types";

/** Zero, as a count or a coordinate. */
const NOTHING = 0;
/** One socket or one step. */
const SINGLE = 1;
/** How many bands each axis is divided into when describing where a node sits. */
const THIRDS = 3;
/** What each vertical band is called. */
const VERTICAL_LABELS = ["top", "middle", "bottom"];
/** What each horizontal band is called. */
const HORIZONTAL_LABELS = ["left", "centre", "right"];

/**
 * Places the sockets of a node graph, and decides which of them may be wired together.
 *
 * Sockets are inputs or outputs, and a link always runs from an output to an input. The rules about
 * what may connect to what are collected here rather than in the component, so the same answer
 * serves the pointer route, the keyboard route and the validity highlighting.
 *
 * Every socket has a stable key built from its node and its own id, which is what lets links survive
 * nodes being moved or re-rendered.
 */
export namespace PatchBoardUtils {
    /** Whether two link ends name the same socket. */
    export const getIsSameEnd = (first: PatchBoardEnd, second: PatchBoardEnd) =>
        first.nodeKey === second.nodeKey && first.socketId === second.socketId;

    /** Whether two links join the same pair of sockets in the same direction. */
    export const getIsSameLink = (first: PatchBoardLink, second: PatchBoardLink) =>
        getIsSameEnd(first.from, second.from) && getIsSameEnd(first.to, second.to);

    /** A socket's key, unique across the board. */
    export const getEndKey = (end: PatchBoardEnd) => `${end.nodeKey}/${end.socketId}`;

    /** A link's key, unique across the board. */
    export const getLinkKey = (link: PatchBoardLink) => `${getEndKey(link.from)}-${getEndKey(link.to)}`;

    /**
     * Where a socket sits, in board coordinates.
     *
     * Sockets of one kind are spread evenly along their own edge, with a share of the edge left at each
     * end, so the outermost socket does not sit in the node's corner. Outputs go on the far edge and
     * inputs on the near one, so links naturally run in one direction across the board.
     *
     * @param placement The node: where it sits, how big it is, and its sockets.
     * @param socket Which socket.
     * @param orientation Which way links run across the board. Vertical puts the sockets on the top and
     * bottom edges, horizontal on the left and right.
     */
    export const getSocketPoint = (
        placement: PatchBoardPlacement,
        socket: PatchBoardSocket,
        orientation: PatchBoardOrientation,
    ): Point2d => {
        const kindred = placement.sockets.filter((entry) => entry.kind === socket.kind);
        const share = (kindred.indexOf(socket) + SINGLE) / (kindred.length + SINGLE);
        const isFarEdge = socket.kind === "out";

        if (orientation === "vertical") {
            return {
                x: placement.spot.x + placement.size.width * share,
                y: placement.spot.y + (isFarEdge ? placement.size.height : NOTHING),
            };
        }

        return {
            x: placement.spot.x + (isFarEdge ? placement.size.width : NOTHING),
            y: placement.spot.y + placement.size.height * share,
        };
    };

    /**
     * Every socket on the board, with its position worked out.
     *
     * @param placements The nodes.
     * @param orientation Which way links run across the board.
     * @returns One entry per socket. A socket belonging to a disabled node is itself disabled, so a
     * caller need not check both.
     */
    export const getPlacedSockets = (
        placements: PatchBoardPlacement[],
        orientation: PatchBoardOrientation = "horizontal",
    ): PatchBoardPlacedSocket[] =>
        placements.flatMap((placement) =>
            placement.sockets.map((socket) => ({
                end: { nodeKey: placement.key, socketId: socket.id },
                kind: socket.kind,
                label: socket.label,
                point: getSocketPoint(placement, socket, orientation),
                isDisabled: placement.isDisabled || (socket.isDisabled ?? false),
            })),
        );

    /**
     * The placed socket a link end refers to.
     *
     * @param placed Every socket on the board.
     * @param end The end to look up.
     */
    export const findSocket = (placed: PatchBoardPlacedSocket[], end: PatchBoardEnd) =>
        placed.find((socket) => getIsSameEnd(socket.end, end));

    /**
     * The socket closest to a point, within a distance.
     *
     * This is what a dragged wire snaps to. The reach is what stops it snapping across the whole board.
     *
     * @param placed Every socket on the board.
     * @param point The wire's loose end.
     * @param reach How far the snap carries.
     * @returns The socket, or `undefined` when none is close enough.
     */
    export const getNearestSocket = (placed: PatchBoardPlacedSocket[], point: Point2d, reach: number) => {
        let nearest: PatchBoardPlacedSocket | undefined;
        let nearestDistance = reach;

        for (const socket of placed) {
            const distance = Math.hypot(socket.point.x - point.x, socket.point.y - point.y);

            if (distance > nearestDistance) continue;

            nearest = socket;
            nearestDistance = distance;
        }

        return nearest;
    };

    /**
     * Every link touching a socket, at either end.
     *
     * @param links The board's links.
     * @param end The socket to ask about.
     */
    export const getLinksAt = (links: PatchBoardLink[], end: PatchBoardEnd) =>
        links.filter((link) => getIsSameEnd(link.from, end) || getIsSameEnd(link.to, end));

    /**
     * Whether a socket cannot take another link.
     *
     * Inputs take one link each — a value has to come from somewhere definite — while outputs may feed
     * as many inputs as they like.
     *
     * @param links The board's links.
     * @param socket The socket to ask about.
     */
    export const getIsFull = (links: PatchBoardLink[], socket: PatchBoardPlacedSocket) =>
        socket.kind === "in" && links.some((link) => getIsSameEnd(link.to, socket.end));

    /**
     * The link a pair of sockets would make.
     *
     * @param first Either socket.
     * @param second The other.
     * @returns The link, always running from the output to the input whichever way round they were
     * given, or `undefined` when both are the same kind and so cannot be joined.
     */
    export const getLink = (
        first: PatchBoardPlacedSocket,
        second: PatchBoardPlacedSocket,
    ): PatchBoardLink | undefined => {
        if (first.kind === second.kind) return undefined;

        return first.kind === "out" ? { from: first.end, to: second.end } : { from: second.end, to: first.end };
    };

    /**
     * Whether a pair of sockets may be wired together.
     *
     * Four refusals: two sockets of the same kind, two sockets on the same node, a disabled socket at
     * either end, and a link that already exists. The fifth is an input that is already fed.
     *
     * @param first Either socket.
     * @param second The other.
     * @param links The board's existing links.
     */
    export const getIsPairAllowed = (
        first: PatchBoardPlacedSocket,
        second: PatchBoardPlacedSocket,
        links: PatchBoardLink[],
    ) => {
        const link = getLink(first, second);

        if (!link) return false;
        if (first.end.nodeKey === second.end.nodeKey) return false;
        if (first.isDisabled || second.isDisabled) return false;
        if (links.some((existing) => getIsSameLink(existing, link))) return false;

        return !getIsFull(links, first.kind === "in" ? first : second);
    };

    /**
     * Holds a node inside the board.
     *
     * Clamped by the node's far edge as well as its near one, so a node dragged towards a corner stops
     * with its whole self visible.
     *
     * @param spot Where the drag wants to put it.
     * @param size The node's size.
     * @param bounds The board's size.
     */
    export const getClampedSpot = (spot: Point2d, size: Size2d, bounds: Size2d): Point2d => ({
        x: MathUtils.clamp(spot.x, NOTHING, Math.max(NOTHING, bounds.width - size.width)),
        y: MathUtils.clamp(spot.y, NOTHING, Math.max(NOTHING, bounds.height - size.height)),
    });

    /**
     * The nodes sorted top to bottom, then left to right.
     *
     * Position on the board is what a sighted user navigates by, so the keyboard should follow the same
     * order rather than the order the nodes happen to be declared in.
     *
     * @param placements The nodes. A copy is sorted, so the caller's array is untouched.
     */
    export const getReadingOrder = (placements: PatchBoardPlacement[]) =>
        [...placements].sort((first, second) => first.spot.y - second.spot.y || first.spot.x - second.spot.x);

    /**
     * Every keyboard stop on the board, in order.
     *
     * Each node is followed by its own sockets, so tabbing through the board walks node, its sockets,
     * next node — which keeps a socket next to the thing it belongs to.
     *
     * @param placements The nodes.
     */
    export const getStopKeys = (placements: PatchBoardPlacement[]) =>
        getReadingOrder(placements).flatMap((placement) => [
            placement.key,
            ...placement.sockets.map((socket) => getEndKey({ nodeKey: placement.key, socketId: socket.id })),
        ]);

    /**
     * The stop a step moves to.
     *
     * Does not wrap: the ends stop rather than jumping across the board, which would lose the user their
     * place.
     *
     * @param keys The stops in order.
     * @param key Where the cursor is now. Missing starts at the first stop.
     * @param step How far to move, negative to go back.
     */
    export const getSteppedKey = (keys: string[], key: string | undefined, step: number) => {
        const index = key === undefined ? -SINGLE : keys.indexOf(key);

        if (index < NOTHING) return keys[NOTHING];

        return keys[MathUtils.clamp(index + step, NOTHING, keys.length - SINGLE)];
    };

    /**
     * The socket a step moves to while a link is being made.
     *
     * This one wraps, since the gesture is a search through the candidates rather than a walk through
     * the board.
     *
     * @param placed Every socket on the board.
     * @param end Where the cursor is now. Missing starts at the first socket.
     * @param step How far to move, negative to go back.
     * @returns The socket, or `undefined` when there are none.
     */
    export const getSteppedSocket = (
        placed: PatchBoardPlacedSocket[],
        end: PatchBoardEnd | undefined,
        step: number,
    ) => {
        if (placed.length < SINGLE) return undefined;

        const index = end === undefined ? -SINGLE : placed.findIndex((socket) => getIsSameEnd(socket.end, end));

        return placed[MathUtils.wrapIndex(index + step, placed.length)];
    };

    /**
     * Where a node sits on the board, in words.
     *
     * A dragged node's new position is invisible to a screen reader, and coordinates would mean nothing
     * read aloud — "middle centre" does. The node's centre is what places it, so a node overlapping two
     * bands is described by the one it mostly occupies.
     *
     * @param spot The node's position.
     * @param size The node's size.
     * @param bounds The board's size.
     * @returns A vertical and a horizontal band, as in `"top left"` or `"middle centre"`.
     */
    export const getRegionLabel = (spot: Point2d, size: Size2d, bounds: Size2d) => {
        const band = (value: number, extent: number) =>
            MathUtils.clamp(Math.floor((value / Math.max(SINGLE, extent)) * THIRDS), NOTHING, THIRDS - SINGLE);

        const vertical = VERTICAL_LABELS[band(spot.y + size.height * 0.5, bounds.height)];
        const horizontal = HORIZONTAL_LABELS[band(spot.x + size.width * 0.5, bounds.width)];

        return `${vertical} ${horizontal}`;
    };
}
