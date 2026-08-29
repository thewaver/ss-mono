import type { AccessorProps, InteractionActivation, InteractionFlags } from "@thewaver/ss-components";

export type RippleMark = InteractionActivation;

export type RippleProps = AccessorProps<{
    flags: InteractionFlags;
    color?: string;
}>;
