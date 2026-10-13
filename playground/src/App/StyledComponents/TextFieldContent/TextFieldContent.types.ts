import type { InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";

export type BaseTextFieldContentValues = {
    flags: InteractionFlags<TextFieldFlags>;
    width?: number;
    height?: number;
    isStretched?: boolean;
};

export type BaseTextFieldContentProps = BaseTextFieldContentValues;
