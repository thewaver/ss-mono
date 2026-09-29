import type { AccessorProps, InteractionFlags, TagInputFlags } from "@thewaver/ss-components-solid";

export type TagInputContentProps = AccessorProps<{
    flags: InteractionFlags<TagInputFlags>;
}>;

export type TagContentProps = AccessorProps<{
    flags: InteractionFlags;
}>;
