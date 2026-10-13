import type { InteractionFlags, TableOfContentsFlags } from "@thewaver/ss-components";

export type BaseTableOfContentsContentValues = {
    flags: InteractionFlags<TableOfContentsFlags>;
    depth: number;
};

export type BaseTableOfContentsContentProps = BaseTableOfContentsContentValues;
