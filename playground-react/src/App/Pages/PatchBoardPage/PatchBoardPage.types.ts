import type { PanZoomView, PatchBoardLink, PatchBoardNode } from "@thewaver/ss-components-react";
import type { PatchDevice } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchDevice.types";

export type PatchBoardExampleProps = {
    socketSize: number;
    isLocked: boolean;
    isDisabled: boolean;
    isBeamPlaying: boolean;
    nodes: readonly [PatchBoardNode<PatchDevice>[], (nodes: PatchBoardNode<PatchDevice>[]) => void];
    links: readonly [PatchBoardLink[], (links: PatchBoardLink[]) => void];
    onLink: (link: PatchBoardLink) => void;
    onUnlink: (link: PatchBoardLink) => void;
    onMove: (nodeKey: string) => void;
};

export type PatchBoardSharedExampleProps = Omit<PatchBoardExampleProps, "nodes" | "links"> & {
    firstNodes: PatchBoardExampleProps["nodes"];
    secondNodes: PatchBoardExampleProps["nodes"];
    firstLinks: PatchBoardExampleProps["links"];
    secondLinks: PatchBoardExampleProps["links"];
};

export type PatchBoardViewExampleProps = PatchBoardExampleProps & {
    view: readonly [PanZoomView, (view: PanZoomView) => void];
};
