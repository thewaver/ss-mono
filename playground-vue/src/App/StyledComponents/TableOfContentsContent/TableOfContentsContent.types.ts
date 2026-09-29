import type { InteractionFlags, TableOfContentsFlags } from "@thewaver/ss-components-vue";

export type TableOfContentsContentProps = {
    flags: InteractionFlags<TableOfContentsFlags>;
    depth: number;
};
