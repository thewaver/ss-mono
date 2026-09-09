import type { AccessorProps, BandDefs, WheelMenuItem } from "@thewaver/ss-components";

export type WheelAction = {
    name: string;
    shortcut?: string;
};

export type WheelMenuExampleProps = AccessorProps<{
    caption: string;
    spreadDegrees?: number;
    opensOnHold?: boolean;
}> & {
    items: WheelMenuItem<WheelAction>[];
    layoutDefs?: BandDefs;
    onActivate: (action: WheelAction) => void;
};
