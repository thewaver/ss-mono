import type { MosaicItemState } from "@thewaver/ss-components-vue";

export type PageMosaicTileProps = {
    state: MosaicItemState;
    width: number;
    height: number;
};

export type PageMosaicLinkProps = {
    href: string;
    caption: string;
};
