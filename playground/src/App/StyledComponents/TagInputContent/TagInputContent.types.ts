import type { InteractionFlags, TagInputFlags } from "@thewaver/ss-components";

export type BaseTagInputContentValues = {
    flags: InteractionFlags<TagInputFlags>;
};

export type BaseTagInputContentProps = BaseTagInputContentValues;

export type BaseTagContentValues = {
    flags: InteractionFlags;
};

export type BaseTagContentProps = BaseTagContentValues;
