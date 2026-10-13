import type { AccessorProps, BandDefs, WheelMenuItem } from "@thewaver/ss-components-solid";
import type { WheelAction } from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.types";

export type { WheelAction } from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.types";

export type WheelMenuExampleProps = AccessorProps<{
    caption: string;
    spreadDegrees?: number;
    holeRadius?: number;
    bandWidth?: number;
    opensOnHold?: boolean;
}> & {
    items: WheelMenuItem<WheelAction>[];
    layoutDefs?: BandDefs;
    onActivate: (action: WheelAction) => void;
};
