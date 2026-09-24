import type { AccessorProps, InteractionFlags, TableOfContentsFlags } from "@thewaver/ss-components";

export type TableOfContentsContentProps = AccessorProps<{
    flags: InteractionFlags<TableOfContentsFlags>;
    depth: number;
}>;
