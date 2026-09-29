import type { InteractionFlags } from "@thewaver/ss-components-react";

export type PageTreemapTileProps = {
    name: string;
    weight: string;
    isBranch: boolean;
};

export type PageTreemapBarProps = {
    flags: InteractionFlags;
    path: string;
    weight: string;
};
