import type { PatchBoardLink, PatchBoardNode } from "@thewaver/ss-components-vue";
import type { PatchDevice } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchDevice.types";

export type PatchBoardExampleProps = {
    "socketSize": number;
    "isLocked": boolean;
    "isDisabled": boolean;
    "isBeamPlaying": boolean;
    "nodes": PatchBoardNode<PatchDevice>[];
    "onUpdate:nodes"?: (nodes: PatchBoardNode<PatchDevice>[]) => void;
    "links": PatchBoardLink[];
    "onUpdate:links"?: (links: PatchBoardLink[]) => void;
    "onLink": (link: PatchBoardLink) => void;
    "onUnlink": (link: PatchBoardLink) => void;
    "onMove": (nodeKey: string) => void;
};

export type PatchBoardZoomExampleProps = PatchBoardExampleProps & {
    zoom: number;
    onZoomChange: (zoom: number) => void;
};
