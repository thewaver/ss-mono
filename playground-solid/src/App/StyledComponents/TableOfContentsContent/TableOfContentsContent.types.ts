import type { AccessorProps, InteractionFlags, TableOfContentsFlags } from "@thewaver/ss-components-solid";

export type TableOfContentsContentProps = AccessorProps<{
    flags: InteractionFlags<TableOfContentsFlags>;
    depth: number;
}>;
