import type {
    InteractionFlags,
    PatchBoardCableDefs,
    PatchBoardNodeFlags,
    PatchBoardSocketFlags,
} from "@thewaver/ss-components-react";

export type PagePatchNodeProps = {
    label: string;
    kind: string;
    flags: InteractionFlags<PatchBoardNodeFlags>;
};

export type PagePatchSocketProps = {
    flags: InteractionFlags<PatchBoardSocketFlags>;
};

export type PagePatchCableProps = {
    defs: PatchBoardCableDefs;
};
