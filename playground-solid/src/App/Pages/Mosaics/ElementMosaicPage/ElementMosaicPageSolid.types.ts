import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseElementsExampleValues,
    BaseWalkedPickCbs,
    BaseWalkedPickValues,
} from "@thewaver/ss-playground/App/Pages/Mosaics/ElementMosaicPage/ElementMosaicPage.types";

import type { MosaicSharedProps } from "../MosaicsSolid.types";

export type ElementsExampleProps = AccessorValues<BaseElementsExampleValues>;

export type WalkedPickProps = AccessorValues<BaseWalkedPickValues> & BaseWalkedPickCbs;

export type WalkedExampleProps = ElementsExampleProps & WalkedPickProps;

export type WalkedExampleWrapperProps = MosaicSharedProps & WalkedPickProps;
