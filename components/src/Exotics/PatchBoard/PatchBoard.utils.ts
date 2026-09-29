import { MathUtils, type Point2d, type Size2d } from "@thewaver/ss-utils";

import type { CarrierZone, Carry, CarryMode, CarryNudge, CarryPlace } from "../../Abstracts/Carrier/Carrier.types";
import { CarrierUtils } from "../../Abstracts/Carrier/Carrier.utils";
import { LiveAnnouncerUtils } from "../../Abstracts/LiveAnnouncer/LiveAnnouncer.utils";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import type {
    PatchBoardCableDefs,
    PatchBoardCarry,
    PatchBoardDefs,
    PatchBoardEnd,
    PatchBoardHandle,
    PatchBoardHorizontalBand,
    PatchBoardLink,
    PatchBoardNode,
    PatchBoardOrientation,
    PatchBoardPendingCable,
    PatchBoardPlace,
    PatchBoardPlacedSocket,
    PatchBoardPlacement,
    PatchBoardRegion,
    PatchBoardSnapFn,
    PatchBoardSocket,
    PatchBoardSocketFlags,
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

/** The board's own width, which every other length on it is a fraction of. */
const FULL_WIDTH = 1;
/** How many steps an arrow key takes while Shift is held. */
const COARSE_STEP_FACTOR = 4;
/** What each arrow key nudges a carry by. */
const NUDGE_KEYS: Record<string, CarryNudge | undefined> = {
    ArrowRight: { x: 1 },
    ArrowLeft: { x: -1 },
    ArrowDown: { y: 1 },
    ArrowUp: { y: -1 },
};

/** A carry's value, as the board wrote it. */
const asCarry = <T>(carry: Carry) => carry.value as PatchBoardCarry<T>;

/** A place, as the board wrote it. */
const asPlace = (place: CarryPlace) => place as PatchBoardPlace;

/**
 * Whether a press landed on a control inside the element handling it, rather than on the element itself. The
 * element is itself a button, so the element alone matching the selector does not count.
 */
const getIsOnInteractiveDescendant = (target: EventTarget | null, currentTarget: EventTarget | null) => {
    const interactive = (target as HTMLElement | null)?.closest(CarrierUtils.INTERACTIVE_SELECTOR) ?? null;

    return interactive !== null && interactive !== currentTarget;
};

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

    /**
     * Where a client point lands on the board, in the board's own unit.
     *
     * The measured box already includes every transform above the board, so dividing by its own width lands the
     * point in fractions of the width at any zoom, with no scale to be told.
     *
     * @param rect The board's measured box.
     * @param point The point, in client coordinates.
     * @returns The point as fractions of the board's width on both axes, or `undefined` while the board has no
     * width to measure against.
     */
    export const getBoardPoint = (rect: DOMRect, point: Point2d): Point2d | undefined => {
        if (rect.width <= NOTHING) return undefined;

        return { x: (point.x - rect.left) / rect.width, y: (point.y - rect.top) / rect.width };
    };

    /**
     * Where an arrow key moves a carried node.
     *
     * Without a snap the node moves by `stepSize` for each step in the nudge. With one, each step goes to the next
     * snapped spot along the direction — {@link getNextSnappedSpot} — since a step smaller than the grid would snap
     * straight back. Either way the node is held inside the board afterwards.
     *
     * @param spot Where the node is aimed now.
     * @param nudge How many steps to take along each axis, signed.
     * @param sizeShare The node's size.
     * @param opts.stepSize How far one step goes, as a fraction of the board's width.
     * @param opts.boundsShare The board's size, in the same unit.
     * @param opts.computeSnapSpot The board's snap, if it has one.
     * @returns The spot to aim at next.
     */
    export const getNudgedSpot = (
        spot: Point2d,
        nudge: CarryNudge,
        sizeShare: Size2d,
        opts: { stepSize: number; boundsShare: Size2d; computeSnapSpot?: PatchBoardSnapFn },
    ) => {
        const x = nudge.x ?? NOTHING;
        const y = nudge.y ?? NOTHING;

        if (!opts.computeSnapSpot) {
            return getClampedSpot(
                { x: spot.x + x * opts.stepSize, y: spot.y + y * opts.stepSize },
                sizeShare,
                opts.boundsShare,
            );
        }

        const stride = { x: Math.sign(x) * opts.stepSize, y: Math.sign(y) * opts.stepSize };
        const reach = Math.max(opts.boundsShare.width, opts.boundsShare.height);

        let next = spot;

        for (let count = Math.max(Math.abs(x), Math.abs(y)); count > NOTHING; count--) {
            const snapped = getNextSnappedSpot(next, stride, reach, opts.computeSnapSpot) ?? next;

            next = getClampedSpot(snapped, sizeShare, opts.boundsShare);
        }

        return next;
    };

    /**
     * Where each node is drawn right now, the one being carried at the spot it is aimed at.
     *
     * A carried node is drawn where it would land rather than where it was taken from, so its sockets move with it
     * and every cable hanging off them follows. Nothing is written back until the drop commits.
     *
     * @param nodes The nodes.
     * @param computeNodeKey The key a node is told apart by.
     * @param carriedNodeKey The node being carried from this board, if any.
     * @param aimedPlace Where the carry from this board is aimed, if anywhere.
     */
    export const getPlacements = <T>(
        nodes: PatchBoardNode<T>[],
        computeNodeKey: (value: T) => string,
        carriedNodeKey: string | undefined,
        aimedPlace: PatchBoardPlace | undefined,
    ): PatchBoardPlacement[] =>
        nodes.map((node) => {
            const key = computeNodeKey(node.value);
            const isAimed = carriedNodeKey === key && aimedPlace?.kind === "spot";

            return {
                key,
                spot: isAimed ? { x: aimedPlace.x, y: aimedPlace.y } : node.spot,
                sizeShare: node.sizeShare,
                sockets: node.sockets,
                isDisabled: node.isDisabled ?? false,
            };
        });

    /** Every placed socket, by its {@link getEndKey}. */
    export const getPlacedSocketByEndKey = (placed: PatchBoardPlacedSocket[]) =>
        new Map(placed.map((socket) => [getEndKey(socket.end), socket]));

    /**
     * Whether a cable may run between two sockets, asked of the board as it is drawn.
     *
     * The board's own refusals — {@link getIsPairAllowed} and a locked board — come first, and the consumer's rule
     * only after they have passed.
     *
     * @param from The socket the cable comes from.
     * @param to The socket it is aimed at.
     * @param opts.links The board's links.
     * @param opts.isLocked Whether the wiring is frozen.
     * @param opts.computeCanLink The consumer's own rule, if any.
     * @returns `false` when either socket is missing.
     */
    export const getIsEndAllowed = (
        from: PatchBoardPlacedSocket | undefined,
        to: PatchBoardPlacedSocket | undefined,
        opts: { links: PatchBoardLink[]; isLocked: boolean; computeCanLink?: (link: PatchBoardLink) => boolean },
    ) => {
        if (!from || !to) return false;
        if (opts.isLocked) return false;
        if (!getIsPairAllowed(from, to, opts.links)) return false;

        const link = getLink(from, to);

        return link !== undefined && (opts.computeCanLink?.(link) ?? true);
    };

    /**
     * What each cable is handed to be drawn: the plugged-in ones, and the one still being carried.
     *
     * A link whose socket is no longer on the board is left out rather than drawn to nowhere. The carried cable is
     * drawn only while it is aimed at a socket or at a free point; a carry aimed at a spot is a node, not a cable.
     *
     * @param links The board's links.
     * @param placedByEndKey Every socket, from {@link getPlacedSocketByEndKey}.
     * @param orientation Which way the board runs, handed on so the painter knows which way to bow.
     * @param pending The cable being carried, if any.
     */
    export const getCableDefs = (
        links: PatchBoardLink[],
        placedByEndKey: Map<string, PatchBoardPlacedSocket>,
        orientation: PatchBoardOrientation,
        pending?: PatchBoardPendingCable,
    ): PatchBoardCableDefs[] => {
        const defs = links.reduce<PatchBoardCableDefs[]>((acc, link) => {
            const from = placedByEndKey.get(getEndKey(link.from));
            const to = placedByEndKey.get(getEndKey(link.to));

            if (from && to) {
                acc.push({
                    key: getLinkKey(link),
                    from: from.point,
                    to: to.point,
                    fromKind: from.kind,
                    orientation,
                    isPending: false,
                    isAllowed: true,
                });
            }

            return acc;
        }, []);

        const from = pending && placedByEndKey.get(getEndKey(pending.from));
        const place = pending?.place;

        if (!pending || !from || !place || place.kind === "spot") return defs;

        const to = place.kind === "socket" ? placedByEndKey.get(getEndKey(place))?.point : { x: place.x, y: place.y };

        if (!to) return defs;

        return [
            ...defs,
            {
                key: pending.key,
                from: from.point,
                to,
                fromKind: from.kind,
                orientation,
                isPending: true,
                isAllowed: pending.isAllowed,
            },
        ];
    };

    /**
     * What one socket's painter is told about it.
     *
     * @param end The socket.
     * @param kind Whether it is an input or an output.
     * @param opts.placed The socket as placed, if it is on the board.
     * @param opts.links The board's links.
     * @param opts.aimedPlace Where the carry from this board is aimed, if anywhere.
     * @param opts.plugSource The socket a cable is being carried from on this board, if any.
     * @param opts.getIsEndAllowed Whether a cable may run between two sockets, as the board answers it.
     */
    export const getSocketFlags = (
        end: PatchBoardEnd,
        kind: PatchBoardSocket["kind"],
        opts: {
            placed: PatchBoardPlacedSocket | undefined;
            links: PatchBoardLink[];
            aimedPlace: PatchBoardPlace | undefined;
            plugSource: PatchBoardEnd | undefined;
            getIsEndAllowed: (fromEnd: PatchBoardEnd, toEnd: PatchBoardEnd) => boolean;
        },
    ): PatchBoardSocketFlags => ({
        kind,
        isTaken: getLinksAt(opts.links, end).length > NOTHING,
        isFull: opts.placed ? getIsFull(opts.links, opts.placed) : false,
        isSource: opts.plugSource !== undefined && getIsSameEnd(opts.plugSource, end),
        isAimed: opts.aimedPlace?.kind === "socket" && getIsSameEnd(opts.aimedPlace, end),
        isAllowed: opts.plugSource !== undefined && opts.getIsEndAllowed(opts.plugSource, end),
    });

    /**
     * Everything the board does that is not drawing it: the zone it offers every carry, picking a node or a cable
     * up by each route, unplugging, the keyboard walk, and the listeners a carry needs while it is in flight.
     *
     * Every answer is read through the getters when it is needed, so the board is made once and follows the view
     * as it changes. The view keeps the drawing — which nodes are where, which stop has focus — and hands the
     * board the parts it has to read. Nodes and links are changed only through `updateNodes` and `updateLinks`.
     *
     * @param defs The board's state and answers, read at the moment they are needed. `getZone` is the zone as it
     * was registered, which a framework may have wrapped, so a carry is always started from the zone the carrier
     * knows.
     * @returns The zone to register, the handlers to attach, and `cancel`, which puts back a carry this board
     * started.
     */
    export const createBoard = <T>(defs: PatchBoardDefs<T>): PatchBoardHandle<T> => {
        let grabOffset: Point2d = { x: NOTHING, y: NOTHING };
        let hasPendingClick = false;

        const getBoundsShare = (): Size2d => ({ width: FULL_WIDTH, height: defs.getHeightRatio() });

        const getNodeKey = (node: PatchBoardNode<T>) => defs.computeNodeKey(node.value);

        const findNode = (nodeKey: string) => defs.getNodes().find((node) => getNodeKey(node) === nodeKey);

        const getPlacedSocket = (end: PatchBoardEnd) => defs.getPlacedSocketByEndKey().get(getEndKey(end));

        const getIsCarryingHere = () => CarrierUtils.getSourceZone() === defs.getZone();

        const finish = (reason: "drop" | "cancel") => CarrierUtils.end(reason, { batch: defs.batch });

        const getEndLabel = (end: PatchBoardEnd) => {
            const node = findNode(end.nodeKey);
            const socket = node?.sockets.find((entry) => entry.id === end.socketId);

            return defs
                .getAnnouncements()
                .computeEndLabel(node ? defs.computeNodeLabel(node.value) : end.nodeKey, socket?.label ?? end.socketId);
        };

        const getIsAllowed = (fromEnd: PatchBoardEnd, toEnd: PatchBoardEnd) =>
            getIsEndAllowed(getPlacedSocket(fromEnd), getPlacedSocket(toEnd), {
                links: defs.getLinks(),
                isLocked: defs.getIsLocked(),
                computeCanLink: defs.getCanLink(),
            });

        const getPoint = (point: Point2d) => {
            const root = defs.getRootRef();

            return root ? getBoardPoint(root.getBoundingClientRect(), point) : undefined;
        };

        const getSnappedSpot = (spot: Point2d) => defs.getSnapSpot()?.(spot) ?? spot;

        const getCandidateSockets = (from: PatchBoardEnd) =>
            [...defs.getPlacedSocketByEndKey().values()].filter((socket) => !getIsSameEnd(socket.end, from));

        const zone: CarrierZone = {
            getGroupId: defs.getGroupId,
            getLabel: defs.getLabel,
            getRootRef: defs.getRootRef,
            getIsDisabled: defs.getIsDisabled,
            getKeyHint: () => {
                const carry = CarrierUtils.getCarry();

                return carry && asCarry<T>(carry).kind === "plug"
                    ? defs.getAnnouncements().plugKeyHint
                    : defs.getAnnouncements().nodeKeyHint;
            },
            getAnnouncements: defs.getAnnouncements,
            computeCanAccept: (carry) => {
                if (defs.getIsDisabled()) return false;

                const value = asCarry<T>(carry);

                if (value.kind === "node") return true;

                return !defs.getIsLocked() && getPlacedSocket(value.from) !== undefined;
            },
            computePlaceAtPoint: (point, carry) => {
                const board = getPoint(point);

                if (!board) return undefined;

                const value = asCarry<T>(carry);

                if (value.kind === "node") {
                    return {
                        kind: "spot",
                        ...getClampedSpot(
                            getSnappedSpot({ x: board.x - grabOffset.x, y: board.y - grabOffset.y }),
                            value.node.sizeShare,
                            getBoundsShare(),
                        ),
                    } satisfies PatchBoardPlace;
                }

                const socket = getNearestSocket(getCandidateSockets(value.from), board, defs.getSocketReach());

                return socket
                    ? ({ kind: "socket", ...socket.end } satisfies PatchBoardPlace)
                    : ({ kind: "free", ...board } satisfies PatchBoardPlace);
            },
            computeNudgedPlace: (place, nudge, carry) => {
                const current = asPlace(place);
                const value = asCarry<T>(carry);

                if (value.kind === "node") {
                    if (current.kind !== "spot") return undefined;

                    return {
                        kind: "spot",
                        ...getNudgedSpot(current, nudge, value.node.sizeShare, {
                            stepSize: defs.getStepSize(),
                            boundsShare: getBoundsShare(),
                            computeSnapSpot: defs.getSnapSpot(),
                        }),
                    } satisfies PatchBoardPlace;
                }

                const step = (nudge.x ?? NOTHING) + (nudge.y ?? NOTHING);

                if (step === NOTHING) return undefined;

                const socket = getSteppedSocket(
                    getCandidateSockets(value.from),
                    current.kind === "socket" ? current : undefined,
                    step,
                );

                return socket ? ({ kind: "socket", ...socket.end } satisfies PatchBoardPlace) : undefined;
            },
            computeEntryPlace: (carry) => {
                const value = asCarry<T>(carry);

                return value.kind === "node"
                    ? ({ kind: "spot", ...value.node.spot } satisfies PatchBoardPlace)
                    : ({ kind: "socket", ...value.from } satisfies PatchBoardPlace);
            },
            computeIsSamePlace: (first, second) => {
                const one = asPlace(first);
                const other = asPlace(second);

                if (one.kind !== other.kind) return false;
                if (one.kind === "socket" && other.kind === "socket") return getIsSameEnd(one, other);
                if (one.kind === "socket" || other.kind === "socket") return false;

                return one.x === other.x && one.y === other.y;
            },
            computeIsPlaceAllowed: (place, carry) => {
                const current = asPlace(place);
                const value = asCarry<T>(carry);

                if (value.kind === "node") return current.kind === "spot";
                if (current.kind !== "socket") return false;

                return getIsAllowed(value.from, current);
            },
            computePlaceLabel: (place, carry) => {
                const current = asPlace(place);
                const value = asCarry<T>(carry);
                const announcements = defs.getAnnouncements();

                if (value.kind === "node") {
                    return current.kind === "spot"
                        ? announcements.computeRegionLabel(getRegion(current, value.node.sizeShare, getBoundsShare()))
                        : announcements.offBoardPlaceLabel;
                }

                if (current.kind !== "socket") return announcements.noSocketPlaceLabel;

                const isRefused =
                    getIsCarryingHere() && !getIsSameEnd(value.from, current) && !getIsAllowed(value.from, current);

                return announcements.computeSocketPlaceLabel(getEndLabel(current), isRefused);
            },
            takeAt: (_unusedPlace, carry) => {
                const value = asCarry<T>(carry);

                if (value.kind !== "node") return;

                const nodeKey = carry.key;
                const orphaned = defs
                    .getLinks()
                    .filter((link) => link.from.nodeKey === nodeKey || link.to.nodeKey === nodeKey);

                defs.updateNodes((nodes) => nodes.filter((node) => getNodeKey(node) !== nodeKey));

                if (orphaned.length < SINGLE) return;

                defs.updateLinks((links) => links.filter((link) => !orphaned.some((cut) => getIsSameLink(cut, link))));

                orphaned.forEach((link) => defs.onUnlink?.(link));
            },
            putAt: (place, carry) => {
                const current = asPlace(place);
                const value = asCarry<T>(carry);

                if (value.kind !== "node" || current.kind !== "spot") return;

                const spot = { x: current.x, y: current.y };

                defs.updateNodes((nodes) => [...nodes, { ...value.node, spot }]);

                defs.onMove?.(carry.key, spot);
            },
            moveAt: (_unusedFrom, toPlace, carry) => {
                const current = asPlace(toPlace);
                const value = asCarry<T>(carry);

                if (value.kind === "node") {
                    if (current.kind !== "spot") return;

                    const spot = { x: current.x, y: current.y };

                    defs.updateNodes((nodes) =>
                        nodes.map((node) => (getNodeKey(node) === carry.key ? { ...node, spot } : node)),
                    );

                    defs.onMove?.(carry.key, spot);

                    return;
                }

                if (current.kind !== "socket") return;

                const from = getPlacedSocket(value.from);
                const to = getPlacedSocket(current);
                const link = from && to && getLink(from, to);

                if (!link) return;

                defs.updateLinks((links) => [...links, link]);

                defs.onLink?.(link);
            },
        };

        const pickUpNode = (node: PatchBoardNode<T>, mode: CarryMode, from?: Point2d) => {
            if (defs.getIsDisabled() || (node.isDisabled ?? false)) return;

            const board = from && getPoint(from);

            grabOffset = board
                ? { x: board.x - node.spot.x, y: board.y - node.spot.y }
                : { x: node.sizeShare.width * 0.5, y: node.sizeShare.height * 0.5 };

            CarrierUtils.start(
                defs.getZone(),
                { kind: "spot", ...node.spot } satisfies PatchBoardPlace,
                {
                    groupId: defs.getGroupId(),
                    key: getNodeKey(node),
                    label: defs.computeNodeLabel(node.value),
                    value: { kind: "node", node } satisfies PatchBoardCarry<T>,
                },
                mode,
            );
        };

        const pickUpPlug = (socket: PatchBoardPlacedSocket, mode: CarryMode) => {
            if (defs.getIsDisabled() || defs.getIsLocked() || socket.isDisabled) return;

            CarrierUtils.start(
                defs.getZone(),
                { kind: "socket", ...socket.end } satisfies PatchBoardPlace,
                {
                    groupId: defs.getGroupId(),
                    key: getEndKey(socket.end),
                    label: defs.getAnnouncements().computeCableLabel(getEndLabel(socket.end)),
                    value: { kind: "plug", from: socket.end } satisfies PatchBoardCarry<T>,
                },
                mode,
            );
        };

        const unplug = (end: PatchBoardEnd) => {
            if (defs.getIsDisabled() || defs.getIsLocked()) return false;

            const cut = getLinksAt(defs.getLinks(), end);

            if (cut.length < SINGLE) return false;

            defs.updateLinks((links) => links.filter((link) => !cut.some((removed) => getIsSameLink(removed, link))));

            cut.forEach((link) => defs.onUnlink?.(link));

            LiveAnnouncerUtils.announce(defs.getAnnouncements().computeUnplugged(getEndLabel(end), cut.length));

            return true;
        };

        const markPendingClick = () => {
            hasPendingClick = true;
        };

        const dropAtPointer = (e: MouseEvent) => {
            if (CarrierUtils.getCarryMode() === "drag") return;
            if (CarrierUtils.getCarryMode() === "key") CarrierUtils.aimAtPoint(e.clientX, e.clientY);

            finish("drop");
        };

        return {
            zone,
            getEndLabel,
            getIsEndAllowed: getIsAllowed,
            handleNodePointerDown: (node, e, currentTarget) => {
                if (e.button !== NOTHING || defs.getIsDisabled()) return;
                if (getIsOnInteractiveDescendant(e.target, currentTarget)) return;
                if (CarrierUtils.getCarry()) return;

                const root = defs.getRootRef();

                if (!root) return;

                CarrierUtils.dragFromPointer(root, e, (from) => pickUpNode(node, "drag", from), markPendingClick, {
                    batch: defs.batch,
                });
            },
            handleSocketPointerDown: (socket, e) => {
                if (e.button !== NOTHING || defs.getIsDisabled() || defs.getIsLocked() || !socket) return;
                if (CarrierUtils.getCarry()) return;

                const root = defs.getRootRef();

                if (!root) return;

                CarrierUtils.dragFromPointer(root, e, () => pickUpPlug(socket, "drag"), markPendingClick, {
                    batch: defs.batch,
                });
            },
            handleNodeClick: (node, e, currentTarget) => {
                if (defs.getIsDisabled()) return;
                if (getIsOnInteractiveDescendant(e.target, currentTarget)) return;

                if (!CarrierUtils.getCarry()) {
                    pickUpNode(node, "tap", { x: e.clientX, y: e.clientY });
                    defs.focusStop(getNodeKey(node));

                    return;
                }

                dropAtPointer(e);
            },
            handleSocketClick: (socket, e) => {
                if (defs.getIsDisabled() || !socket) return;

                if (CarrierUtils.getCarry()) {
                    dropAtPointer(e);

                    return;
                }

                defs.focusStop(getEndKey(socket.end));

                if (getIsFull(defs.getLinks(), socket)) {
                    unplug(socket.end);

                    return;
                }

                pickUpPlug(socket, "tap");
            },
            handleStopKeyDown: (stopKey, node, socket, e) => {
                if (defs.getIsDisabled()) return;

                const isCarrying = CarrierUtils.getCarry() !== undefined && CarrierUtils.getCarryMode() !== "drag";

                if (e.key === "Escape") {
                    if (!isCarrying) return;

                    e.preventDefault();
                    finish("cancel");

                    return;
                }

                if (NavigatorUtils.getIsActivationKey(e.key)) {
                    e.preventDefault();

                    if (isCarrying) {
                        finish("drop");

                        return;
                    }

                    if (!socket) {
                        pickUpNode(node, "key");

                        return;
                    }

                    if (getIsFull(defs.getLinks(), socket)) {
                        unplug(socket.end);

                        return;
                    }

                    pickUpPlug(socket, "key");

                    return;
                }

                if (isCarrying) {
                    const nudge = NUDGE_KEYS[e.key];

                    if (!nudge) return;

                    e.preventDefault();
                    CarrierUtils.aimAtNudge(
                        e.shiftKey
                            ? {
                                  x: (nudge.x ?? NOTHING) * COARSE_STEP_FACTOR,
                                  y: (nudge.y ?? NOTHING) * COARSE_STEP_FACTOR,
                              }
                            : nudge,
                    );

                    return;
                }

                if (e.key === "Delete" || e.key === "Backspace") {
                    if (!socket) return;

                    e.preventDefault();
                    unplug(socket.end);

                    return;
                }

                const nodeKeys = getReadingOrder(defs.getPlacements()).map((entry) => entry.key);

                if (e.key === "Home" || e.key === "End") {
                    e.preventDefault();
                    defs.focusStop(e.key === "Home" ? nodeKeys[NOTHING] : nodeKeys[nodeKeys.length - SINGLE]);

                    return;
                }

                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    defs.focusStop(
                        getSteppedKey(
                            getStopKeys(defs.getPlacements()),
                            stopKey,
                            e.key === "ArrowRight" ? SINGLE : -SINGLE,
                        ),
                    );

                    return;
                }

                if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

                e.preventDefault();
                defs.focusStop(getSteppedKey(nodeKeys, getNodeKey(node), e.key === "ArrowDown" ? SINGLE : -SINGLE));
            },
            handleRootClick: (e) => {
                if (defs.getIsDisabled() || !CarrierUtils.getCarry()) return;
                if (e.target !== defs.getRootRef()) return;

                dropAtPointer(e);
            },
            observeClicks: (root) => {
                const swallowClick = (e: MouseEvent) => {
                    if (!hasPendingClick) return;

                    hasPendingClick = false;

                    e.preventDefault();
                    e.stopPropagation();
                };

                root.addEventListener("click", swallowClick, true);

                return () => root.removeEventListener("click", swallowClick, true);
            },
            observeTapAim: () => {
                const trackPoint = (e: PointerEvent) => {
                    if (CarrierUtils.getCarryMode() !== "tap") return;

                    CarrierUtils.aimAtPoint(e.clientX, e.clientY);
                };

                document.addEventListener("pointermove", trackPoint, true);

                return () => document.removeEventListener("pointermove", trackPoint, true);
            },
            cancel: () => {
                if (getIsCarryingHere()) finish("cancel");
            },
        };
    };
}
