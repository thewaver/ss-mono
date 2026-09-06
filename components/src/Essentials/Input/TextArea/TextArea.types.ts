import type { TextFieldPresetProps } from "../../../Primitives/TextField/TextField.types";
import type { AccessorProps } from "../../../Utils/typeUtils";

export type TextAreaProps = Omit<TextFieldPresetProps, "type" | "min" | "max" | "step"> &
    AccessorProps<{
        isAutoSizing?: boolean;
        minRows?: number;
        maxRows?: number;
    }>;
