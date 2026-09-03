import type { AccessorProps, PatchBoardLink, PatchBoardNode, SignalSource } from "@thewaver/ss-components";

export type PatchDevice = {
    id: string;
    name: string;
    kind: string;
};

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
