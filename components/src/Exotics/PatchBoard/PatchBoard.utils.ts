import { MathUtils, type Point2d, type Size2d } from "@thewaver/ss-utils";

import type {
    PatchBoardEnd,
    PatchBoardLink,
    PatchBoardOrientation,
    PatchBoardPlacedSocket,
    PatchBoardPlacement,
    PatchBoardSocket,
} from "./PatchBoard.types";

const NOTHING = 0;
const SINGLE = 1;
const THIRDS = 3;
const VERTICAL_LABELS = ["top", "middle", "bottom"];
const HORIZONTAL_LABELS = ["left", "centre", "right"];

export namespace PatchBoardUtils {
    export const getIsSameEnd = (first: PatchBoardEnd, second: PatchBoardEnd) =>
        first.nodeKey === second.nodeKey && first.socketId === second.socketId;

    export const getIsSameLink = (first: PatchBoardLink, second: PatchBoardLink) =>
        getIsSameEnd(first.from, second.from) && getIsSameEnd(first.to, second.to);

    export const getEndKey = (end: PatchBoardEnd) => `${end.nodeKey}/${end.socketId}`;

    export const getLinkKey = (link: PatchBoardLink) => `${getEndKey(link.from)}-${getEndKey(link.to)}`;

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

    export const findSocket = (placed: PatchBoardPlacedSocket[], end: PatchBoardEnd) =>
        placed.find((socket) => getIsSameEnd(socket.end, end));

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

    export const getLinksAt = (links: PatchBoardLink[], end: PatchBoardEnd) =>
        links.filter((link) => getIsSameEnd(link.from, end) || getIsSameEnd(link.to, end));

    export const getIsFull = (links: PatchBoardLink[], socket: PatchBoardPlacedSocket) =>
        socket.kind === "in" && links.some((link) => getIsSameEnd(link.to, socket.end));

    export const getLink = (
        first: PatchBoardPlacedSocket,
        second: PatchBoardPlacedSocket,
    ): PatchBoardLink | undefined => {
        if (first.kind === second.kind) return undefined;

        return first.kind === "out" ? { from: first.end, to: second.end } : { from: second.end, to: first.end };
    };

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

    export const getClampedSpot = (spot: Point2d, size: Size2d, bounds: Size2d): Point2d => ({
        x: MathUtils.clamp(spot.x, NOTHING, Math.max(NOTHING, bounds.width - size.width)),
        y: MathUtils.clamp(spot.y, NOTHING, Math.max(NOTHING, bounds.height - size.height)),
    });

    export const getReadingOrder = (placements: PatchBoardPlacement[]) =>
        [...placements].sort((first, second) => first.spot.y - second.spot.y || first.spot.x - second.spot.x);

    export const getStopKeys = (placements: PatchBoardPlacement[]) =>
        getReadingOrder(placements).flatMap((placement) => [
            placement.key,
            ...placement.sockets.map((socket) => getEndKey({ nodeKey: placement.key, socketId: socket.id })),
        ]);

    export const getSteppedKey = (keys: string[], key: string | undefined, step: number) => {
        const index = key === undefined ? -SINGLE : keys.indexOf(key);

        if (index < NOTHING) return keys[NOTHING];

        return keys[MathUtils.clamp(index + step, NOTHING, keys.length - SINGLE)];
    };

    export const getSteppedSocket = (
        placed: PatchBoardPlacedSocket[],
        end: PatchBoardEnd | undefined,
        step: number,
    ) => {
        if (placed.length < SINGLE) return undefined;

        const index = end === undefined ? -SINGLE : placed.findIndex((socket) => getIsSameEnd(socket.end, end));

        return placed[MathUtils.wrapIndex(index + step, placed.length)];
    };

    export const getRegionLabel = (spot: Point2d, size: Size2d, bounds: Size2d) => {
        const band = (value: number, extent: number) =>
            MathUtils.clamp(Math.floor((value / Math.max(SINGLE, extent)) * THIRDS), NOTHING, THIRDS - SINGLE);

        const vertical = VERTICAL_LABELS[band(spot.y + size.height / 2, bounds.height)];
        const horizontal = HORIZONTAL_LABELS[band(spot.x + size.width / 2, bounds.width)];

        return `${vertical} ${horizontal}`;
    };
}
