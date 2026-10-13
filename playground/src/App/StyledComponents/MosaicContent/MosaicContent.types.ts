import type { MosaicItemState } from "@thewaver/ss-components";

export type BasePageMosaicTileValues = {
    state: MosaicItemState;
    width: number;
    height: number;
};

export type BasePageMosaicTileProps = BasePageMosaicTileValues;

export type BasePageMosaicLinkValues = {
    href: string;
    caption: string;
};

export type BasePageMosaicLinkProps = BasePageMosaicLinkValues;
