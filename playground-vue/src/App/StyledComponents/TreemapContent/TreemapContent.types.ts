import type { InteractionFlags } from "@thewaver/ss-components-vue";

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
