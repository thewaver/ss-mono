import type { InteractionFlags, TextFieldFlags } from "@thewaver/ss-components-svelte";

export type TextFieldPlaceholderProps = {
    flags: InteractionFlags<TextFieldFlags>;
    isTopAligned?: boolean;
};
