import type {
    BaseElementsExampleProps,
    BaseWalkedPickProps,
} from "@thewaver/ss-playground/App/Pages/Mosaics/ElementMosaicPage/ElementMosaicPage.types";

import type { MosaicSharedProps } from "../MosaicsSvelte.types";

export type ElementsExampleProps = BaseElementsExampleProps;

export type WalkedPickProps = BaseWalkedPickProps;

export type WalkedExampleProps = ElementsExampleProps & WalkedPickProps;

export type WalkedExampleWrapperProps = MosaicSharedProps & WalkedPickProps;
