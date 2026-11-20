import type { PanZoomView, PatchBoardLink, PatchBoardNode } from "@thewaver/ss-components-vue";
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

export type PatchBoardSharedExampleProps = Omit<
    PatchBoardExampleProps,
    "nodes" | "onUpdate:nodes" | "links" | "onUpdate:links"
> & {
    "firstNodes": PatchBoardNode<PatchDevice>[];
    "onUpdate:firstNodes"?: (nodes: PatchBoardNode<PatchDevice>[]) => void;
    "secondNodes": PatchBoardNode<PatchDevice>[];
    "onUpdate:secondNodes"?: (nodes: PatchBoardNode<PatchDevice>[]) => void;
    "firstLinks": PatchBoardLink[];
    "onUpdate:firstLinks"?: (links: PatchBoardLink[]) => void;
    "secondLinks": PatchBoardLink[];
    "onUpdate:secondLinks"?: (links: PatchBoardLink[]) => void;
};

export type PatchBoardViewExampleProps = PatchBoardExampleProps & {
    "view": PanZoomView;
    "onUpdate:view"?: (view: PanZoomView) => void;
};
