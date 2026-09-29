import type { InteractionFlags, TextFieldFlags } from "@thewaver/ss-components-svelte";

export type TextFieldContentProps = {
    flags: InteractionFlags<TextFieldFlags>;
    width?: number;
    height?: number;
    isStretched?: boolean;
};
