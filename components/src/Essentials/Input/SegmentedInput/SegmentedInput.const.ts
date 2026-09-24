import { TextSyncUtils } from "../../../Abstracts/TextSync/TextSync.utils";
import type { TextFieldMode } from "../../../Primitives/TextField/TextField.types";

export const SEGMENTED_INPUT_DEFAULTS = {
    gap: 0,
    inputMode: "numeric" as TextFieldMode,
    computeIsAllowed: TextSyncUtils.getIsMaskDigit,
};
