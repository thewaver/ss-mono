import type { InteractionFlags, TableOfContentsFlags } from "@thewaver/ss-components-svelte";

export type TableOfContentsContentProps = {
    flags: InteractionFlags<TableOfContentsFlags>;
    depth: number;
};
