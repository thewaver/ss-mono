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
    groupId: string;
    ariaLabel: string;
    size: Size2d;
    orientation?: PatchBoardOrientation;
    socketSize?: number;
    socketReach?: number;
    stepSize?: number;
    isDisabled?: boolean;
    isLocked?: boolean;
    linksSignal: SignalSource<PatchBoardLink[]>;
    computeCanLink?: (link: PatchBoardLink) => boolean;
    renderSocket?: (
        getSocket: Accessor<PatchBoardSocket>,
        getFlags: () => InteractionFlags<PatchBoardSocketFlags>,
    ) => JSX.Element;
    renderCable: (getDefs: Accessor<PatchBoardCableDefs>) => JSX.Element;
    onLink?: (link: PatchBoardLink) => void;
    onUnlink?: (link: PatchBoardLink) => void;
    onMove?: (nodeKey: string, spot: Point2d) => void;
}> & {
    nodesSignal: SignalSource<PatchBoardNode<T>[]>;
    computeNodeKey: (value: T) => string;
    computeNodeLabel: (value: T) => string;
    renderNode: (
        getNode: Accessor<PatchBoardNode<T>>,
        getFlags: () => InteractionFlags<PatchBoardNodeFlags>,
    ) => JSX.Element;
};
