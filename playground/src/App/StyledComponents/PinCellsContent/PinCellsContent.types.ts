import type { AccessorProps, InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";

export type PinCellsContentProps = AccessorProps<{
    flags: InteractionFlags<TextFieldFlags>;
    value: string;
    length: number;
}>;
