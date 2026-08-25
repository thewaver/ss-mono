import type { AccessorProps, InteractionFlags, TagInputFlags } from "@thewaver/ss-components";

export type TagInputContentProps = AccessorProps<{
    flags: InteractionFlags<TagInputFlags>;
}>;

export type TagContentProps = AccessorProps<{
    flags: InteractionFlags;
}>;
