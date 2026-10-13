import type { BaseTextAreaProps } from "@thewaver/ss-components";

import type { TextFieldPresetProps } from "../../../Primitives/TextField/TextField.types.js";

export type TextAreaProps = Omit<TextFieldPresetProps, "type" | "min" | "max" | "step"> & BaseTextAreaProps;
