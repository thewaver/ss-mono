import type {
    InteractionFlags,
    PatchBoardCableDefs,
    PatchBoardNodeFlags,
    PatchBoardSocketFlags,
} from "@thewaver/ss-components";

export type BasePagePatchNodeValues = {
    label: string;
    kind: string;
    flags: InteractionFlags<PatchBoardNodeFlags>;
};

export type BasePagePatchNodeProps = BasePagePatchNodeValues;

export type BasePagePatchSocketValues = {
    flags: InteractionFlags<PatchBoardSocketFlags>;
};

export type BasePagePatchSocketProps = BasePagePatchSocketValues;

export type BasePagePatchCableValues = {
    defs: PatchBoardCableDefs;
    isBeamPlaying: boolean;
};

export type BasePagePatchCableProps = BasePagePatchCableValues;
