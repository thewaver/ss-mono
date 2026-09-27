import type { InteractionFlags, TableOfContentsFlags } from "@thewaver/ss-components-react";

export type TableOfContentsContentProps = {
    flags: InteractionFlags<TableOfContentsFlags>;
    depth: number;
};
