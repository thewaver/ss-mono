import type { AccessorProps, MosaicSizeAnchor } from "@thewaver/ss-components";

import type { MosaicSharedProps, PageMosaicTileDefs } from "../Mosaics.types";

export type ElementsExampleProps = AccessorProps<{
    items: PageMosaicTileDefs[];
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    transitionDurationMs: number;
}>;

export type WalkedPickProps = AccessorProps<{
    pickedNames: string[];
    onActivate: (index: number) => void;
}>;

export type WalkedExampleProps = ElementsExampleProps & WalkedPickProps;

export type WalkedExampleWrapperProps = MosaicSharedProps & WalkedPickProps;
