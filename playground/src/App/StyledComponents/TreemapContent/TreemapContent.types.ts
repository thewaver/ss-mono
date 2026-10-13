import type { InteractionFlags } from "@thewaver/ss-components";

export type BasePageTreemapTileValues = {
    name: string;
    weight: string;
    isBranch: boolean;
};

export type BasePageTreemapTileProps = BasePageTreemapTileValues;

export type BasePageTreemapBarValues = {
    flags: InteractionFlags;
    path: string;
    weight: string;
};

export type BasePageTreemapBarProps = BasePageTreemapBarValues;
