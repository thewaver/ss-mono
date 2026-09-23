import type { TextFieldMode } from "../../../Primitives/TextField/TextField.types";

export const NUMBER_INPUT_DEFAULTS = {
    step: 1,
    repeatIntervalMs: 60,
    repeatDelayMs: 400,
    inputMode: "decimal" as TextFieldMode,
};
