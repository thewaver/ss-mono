import type { AccessorProps, MosaicItemState } from "@thewaver/ss-components";

export type PageMosaicTileProps = AccessorProps<{
    state: MosaicItemState;
    width: number;
    height: number;
}>;

export type PageMosaicLinkProps = AccessorProps<{
    href: string;
    caption: string;
}>;
