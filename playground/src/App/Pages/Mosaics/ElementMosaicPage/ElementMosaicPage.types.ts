import type { MosaicSizeAnchor } from "@thewaver/ss-components";

import type { PageMosaicTileDefs } from "../MosaicTile.types";

export type BaseElementsExampleValues = {
    items: PageMosaicTileDefs[];
    gap: number;
    sizeAnchor: MosaicSizeAnchor;
    transitionDurationMs: number;
};

export type BaseElementsExampleProps = BaseElementsExampleValues;

export type BaseWalkedPickValues = {
    pickedNames: string[];
};

export type BaseWalkedPickCbs = {
    onActivate: (index: number) => void;
};

export type BaseWalkedPickProps = BaseWalkedPickValues & BaseWalkedPickCbs;
