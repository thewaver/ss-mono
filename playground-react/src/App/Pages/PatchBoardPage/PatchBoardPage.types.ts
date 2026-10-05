import type { PatchBoardLink, PatchBoardNode } from "@thewaver/ss-components-react";
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

export type PatchBoardZoomExampleProps = PatchBoardExampleProps & {
    zoom: number;
    onZoomChange: (zoom: number) => void;
};
