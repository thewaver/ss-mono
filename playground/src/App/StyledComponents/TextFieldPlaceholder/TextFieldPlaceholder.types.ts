import type { AccessorProps, InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";

export type TextFieldPlaceholderProps = AccessorProps<{
    flags: InteractionFlags<TextFieldFlags>;
    isTopAligned?: boolean;
}>;
