import type {
    AccessorProps,
    InteractionFlags,
    PatchBoardCableDefs,
    PatchBoardNodeFlags,
    PatchBoardSocketFlags,
} from "@thewaver/ss-components";

export type PagePatchNodeProps = AccessorProps<{
    label: string;
    kind: string;
    flags: InteractionFlags<PatchBoardNodeFlags>;
}>;

export type PagePatchSocketProps = AccessorProps<{
    flags: InteractionFlags<PatchBoardSocketFlags>;
}>;

export type PagePatchCableProps = AccessorProps<{
    defs: PatchBoardCableDefs;
}>;
