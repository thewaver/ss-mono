import type { AccessorProps, PatchBoardLink, PatchBoardNode, SignalSource } from "@thewaver/ss-components-solid";
import type { PatchDevice } from "@thewaver/ss-playground-core/App/Pages/PatchBoardPage/PatchDevice.types";

export type PatchBoardExampleProps = AccessorProps<{
    socketSize: number;
    isLocked: boolean;
    isDisabled: boolean;
    nodesSignal: SignalSource<PatchBoardNode<PatchDevice>[]>;
    linksSignal: SignalSource<PatchBoardLink[]>;
    onLink: (link: PatchBoardLink) => void;
    onUnlink: (link: PatchBoardLink) => void;
    onMove: (nodeKey: string) => void;
}>;

export type PatchBoardZoomExampleProps = PatchBoardExampleProps &
    AccessorProps<{
        zoom: number;
        onZoomChange: (zoom: number) => void;
    }>;
