import type { BaseTextAreaValues } from "@thewaver/ss-components";

import type { TextFieldPresetProps } from "../../../Primitives/TextField/TextFieldSolid.types";
import type { AccessorValues } from "../../../Utils/typeUtils";

export type TextAreaProps = Omit<TextFieldPresetProps, "type" | "min" | "max" | "step"> &
    AccessorValues<BaseTextAreaValues>;
