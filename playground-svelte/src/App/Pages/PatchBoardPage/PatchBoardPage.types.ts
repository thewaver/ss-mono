import type { PanZoomView, PatchBoardLink, PatchBoardNode } from "@thewaver/ss-components-svelte";
import type { PatchDevice } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchDevice.types";

export type PatchBoardExampleProps = {
    socketSize: number;
    isLocked: boolean;
    isDisabled: boolean;
    isBeamPlaying: boolean;
    nodes: PatchBoardNode<PatchDevice>[];
    links: PatchBoardLink[];
    onLink: (link: PatchBoardLink) => void;
    onUnlink: (link: PatchBoardLink) => void;
    onMove: (nodeKey: string) => void;
};

export type PatchBoardViewExampleProps = PatchBoardExampleProps & {
    view: PanZoomView;
};
