import type { MosaicSizeAnchor } from "@thewaver/ss-components-vue";
import type { PageMosaicTileDefs } from "@thewaver/ss-playground/App/Pages/Mosaics/MosaicTile.types";

import type { MosaicSharedProps } from "../Mosaics.types";

export type ElementsExampleProps = {
    items: PageMosaicTileDefs[];
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    transitionDurationMs: number;
};

export type WalkedPickProps = {
    pickedNames: string[];
    onActivate: (index: number) => void;
};

export type WalkedExampleProps = ElementsExampleProps & WalkedPickProps;

export type WalkedExampleWrapperProps = MosaicSharedProps & WalkedPickProps;
