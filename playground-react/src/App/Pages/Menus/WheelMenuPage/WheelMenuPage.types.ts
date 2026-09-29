import type { BandDefs, WheelMenuItem } from "@thewaver/ss-components-react";

export type WheelAction = {
    name: string;
    shortcut?: string;
};

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
