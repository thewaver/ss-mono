import type { AccessorProps, MosaicSizeAnchor } from "@thewaver/ss-components-solid";
import type { PageMosaicTileDefs } from "@thewaver/ss-playground-core/App/Pages/Mosaics/MosaicTile.types";

import type { MosaicSharedProps } from "../Mosaics.types";

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
