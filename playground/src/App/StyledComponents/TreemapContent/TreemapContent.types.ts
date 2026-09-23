import type { AccessorProps, InteractionFlags } from "@thewaver/ss-components";

export type PageTreemapTileProps = AccessorProps<{
    name: string;
    weight: string;
    isBranch: boolean;
}>;

export type PageTreemapBarProps = AccessorProps<{
    flags: InteractionFlags;
    path: string;
    weight: string;
}>;
