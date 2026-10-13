import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BasePagePatchCableValues,
    BasePagePatchNodeValues,
    BasePagePatchSocketValues,
} from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.types";

export type PagePatchNodeProps = AccessorValues<BasePagePatchNodeValues>;

export type PagePatchSocketProps = AccessorValues<BasePagePatchSocketValues>;

export type PagePatchCableProps = AccessorValues<BasePagePatchCableValues>;
