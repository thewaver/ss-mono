import type { BandDefs, WheelMenuItem } from "@thewaver/ss-components-react";
import type { WheelAction } from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.types";

export type { WheelAction } from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.types";

export type WheelMenuExampleProps = {
    caption: string;
    spreadDegrees?: number;
    holeRadius?: number;
    bandWidth?: number;
    opensOnHold?: boolean;
    items: WheelMenuItem<WheelAction>[];
    layoutDefs?: BandDefs;
    onActivate: (action: WheelAction) => void;
};
