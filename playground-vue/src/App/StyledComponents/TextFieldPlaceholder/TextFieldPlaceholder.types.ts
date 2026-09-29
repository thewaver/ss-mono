import type { InteractionFlags, TextFieldFlags } from "@thewaver/ss-components-vue";

export type TextFieldPlaceholderProps = {
    flags: InteractionFlags<TextFieldFlags>;
    isTopAligned?: boolean;
};
