import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseWheelMenuBandsDocsExampleValues,
    BaseWheelMenuBasicDocsExampleValues,
    BaseWheelMenuFlickDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.types";

export type { WheelAction } from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.types";

export type WheelMenuBasicDocsExampleProps = AccessorValues<BaseWheelMenuBasicDocsExampleValues>;

export type WheelMenuBandsDocsExampleProps = AccessorValues<BaseWheelMenuBandsDocsExampleValues>;

export type WheelMenuFlickDocsExampleProps = AccessorValues<BaseWheelMenuFlickDocsExampleValues>;

export type WheelGradientDefsProps = {
    gradientId: string;
};
