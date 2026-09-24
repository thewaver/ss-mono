import { MathUtils, type Point2d, type Size2d } from "@thewaver/ss-utils";

import type {
    PatchBoardEnd,
    PatchBoardHorizontalBand,
    PatchBoardLink,
    PatchBoardOrientation,
    PatchBoardPlacedSocket,
    PatchBoardPlacement,
    PatchBoardRegion,
    PatchBoardSnapFn,
    PatchBoardSocket,
    PatchBoardVerticalBand,
} from "./PatchBoard.types";

/** Zero, as a count or a coordinate. */
const NOTHING = 0;
/** One socket or one step. */
const SINGLE = 1;
/** How much further along a snapped spot has to be, as a fraction of the board's width, to count as a move. */
const SNAP_TOLERANCE = 0.000001;
/** How many bands each axis is divided into when describing where a node sits. */
const THIRDS = 3;
/** The vertical bands, top first. */
const VERTICAL_BANDS: PatchBoardVerticalBand[] = ["top", "middle", "bottom"];
/** The horizontal bands, left first. */
const HORIZONTAL_BANDS: PatchBoardHorizontalBand[] = ["left", "center", "right"];

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
     * Where a socket sits, in the same unit as the node's own spot and size.
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
                x: placement.spot.x + placement.sizeShare.width * share,
                y: placement.spot.y + (isFarEdge ? placement.sizeShare.height : NOTHING),
            };
        }

        return {
            x: placement.spot.x + (isFarEdge ? placement.sizeShare.width : NOTHING),
            y: placement.spot.y + placement.sizeShare.height * share,
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
     * @param reach How far the snap carries, in the same unit as the points.
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
     * @param sizeShare The node's size.
     * @param boundsShare The board's size, in the same unit as the spot.
     */
    export const getClampedSpot = (spot: Point2d, sizeShare: Size2d, boundsShare: Size2d): Point2d => ({
        x: MathUtils.clamp(spot.x, NOTHING, Math.max(NOTHING, boundsShare.width - sizeShare.width)),
        y: MathUtils.clamp(spot.y, NOTHING, Math.max(NOTHING, boundsShare.height - sizeShare.height)),
    });

    /**
     * The next spot a snap allows in one direction, for moving a node over a grid by keyboard.
     *
     * An arrow key on a snapped board has to go to the next allowed spot rather than by a fixed step, or a
     * step smaller than the grid would snap straight back to where it started and the key would do nothing.
     * So the direction is probed one stride at a time, each probe is snapped, and the first snapped spot
     * that is further along the direction than the start is the answer. A snap finer than the stride can be
     * stepped over, which is what makes the stride the finest move the key makes.
     *
     * @param spot Where the node is now. It need not be a snapped spot itself.
     * @param stride One probe's move, which also says the direction, such as `{ x: 0.02, y: 0 }` for right.
     * @param reach How far to probe before giving up; the board's longer side covers every spot on it.
     * @param computeSnapSpot The snap to apply to each probe.
     * @returns The snapped spot, which may lie outside the board and is for the caller to clamp, or
     * `undefined` when the stride is zero or nothing further along is within reach.
     */
    export const getNextSnappedSpot = (
        spot: Point2d,
        stride: Point2d,
        reach: number,
        computeSnapSpot: PatchBoardSnapFn,
    ) => {
        const length = Math.hypot(stride.x, stride.y);

        if (length <= NOTHING) return undefined;

        const probeCount = Math.floor(reach / length);

        for (let probe = SINGLE; probe <= probeCount; probe++) {
            const snapped = computeSnapSpot({ x: spot.x + stride.x * probe, y: spot.y + stride.y * probe });
            const progress = ((snapped.x - spot.x) * stride.x + (snapped.y - spot.y) * stride.y) / length;

            if (progress > SNAP_TOLERANCE) return snapped;
        }

        return undefined;
    };

    /**
     * Whether a new link would let a signal find its way back to the node it came from.
     *
     * Made for a consumer's `computeCanLink`, since the board itself allows loops: a feedback path is
     * legitimate on some boards and nonsense on others. Links are followed from output to input, node to
     * node, starting at the new link's input; reaching the new link's output node means the link closes a
     * loop. A link from a node to itself closes one trivially. Which socket on a node a link uses does not
     * matter, only which node it reaches.
     *
     * @param links The board's existing links, without the new one.
     * @param link The link being asked about.
     * @returns `true` when adding the link would make a loop.
     */
    export const getClosesLoop = (links: PatchBoardLink[], link: PatchBoardLink) => {
        const visited = new Set<string>();
        const pending = [link.to.nodeKey];

        for (let nodeKey = pending.pop(); nodeKey !== undefined; nodeKey = pending.pop()) {
            if (nodeKey === link.from.nodeKey) return true;
            if (visited.has(nodeKey)) continue;

            visited.add(nodeKey);

            links.forEach((entry) => {
                if (entry.from.nodeKey === nodeKey) pending.push(entry.to.nodeKey);
            });
        }

        return false;
    };

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
     * Which third of the board a node sits in, across and down.
     *
     * A dragged node's new position is invisible to a screen reader, and coordinates would mean nothing
     * read aloud — a region can be put into words. The node's center is what places it, so a node
     * overlapping two bands is described by the one it mostly occupies, and a node hanging off the edge
     * is given the band nearest to it.
     *
     * @param spot The node's position.
     * @param sizeShare The node's size.
     * @param boundsShare The board's size, in the same unit as the spot. An empty axis puts every node in its first band.
     * @returns A vertical and a horizontal band, such as `top` and `left`, for the consumer to word.
     */
    export const getRegion = (spot: Point2d, sizeShare: Size2d, boundsShare: Size2d): PatchBoardRegion => {
        const band = (value: number, extent: number) =>
            extent > NOTHING
                ? MathUtils.clamp(Math.floor((value / extent) * THIRDS), NOTHING, THIRDS - SINGLE)
                : NOTHING;

        return {
            vertical: VERTICAL_BANDS[band(spot.y + sizeShare.height * 0.5, boundsShare.height)],
            horizontal: HORIZONTAL_BANDS[band(spot.x + sizeShare.width * 0.5, boundsShare.width)],
        };
    };
}
