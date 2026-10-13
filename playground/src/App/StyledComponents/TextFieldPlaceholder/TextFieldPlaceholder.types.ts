import type { InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";

export type BaseTextFieldPlaceholderValues = {
    flags: InteractionFlags<TextFieldFlags>;
    isTopAligned?: boolean;
};

export type BaseTextFieldPlaceholderProps = BaseTextFieldPlaceholderValues;
