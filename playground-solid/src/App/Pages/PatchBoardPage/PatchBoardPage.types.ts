import type {
    AccessorProps,
    PanZoomView,
    PatchBoardLink,
    PatchBoardNode,
    SignalSource,
} from "@thewaver/ss-components-solid";
import type { PatchDevice } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchDevice.types";

export type PatchBoardExampleProps = AccessorProps<{
    socketSize: number;
    isLocked: boolean;
    isDisabled: boolean;
    isBeamPlaying: boolean;
    nodes: SignalSource<PatchBoardNode<PatchDevice>[]>;
    links: SignalSource<PatchBoardLink[]>;
    onLink: (link: PatchBoardLink) => void;
    onUnlink: (link: PatchBoardLink) => void;
    onMove: (nodeKey: string) => void;
}>;

export type PatchBoardViewExampleProps = PatchBoardExampleProps & {
    view: SignalSource<PanZoomView>;
};
