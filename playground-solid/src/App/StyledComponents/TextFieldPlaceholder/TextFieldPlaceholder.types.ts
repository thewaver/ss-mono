import type { AccessorProps, InteractionFlags, TextFieldFlags } from "@thewaver/ss-components-solid";

export type TextFieldPlaceholderProps = AccessorProps<{
    flags: InteractionFlags<TextFieldFlags>;
    isTopAligned?: boolean;
}>;
