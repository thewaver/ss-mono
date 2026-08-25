import type { AccessorProps, InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";

export type TextFieldContentProps = AccessorProps<{
    flags: InteractionFlags<TextFieldFlags>;
    width?: number;
    height?: number;
    isStretched?: boolean;
}>;
