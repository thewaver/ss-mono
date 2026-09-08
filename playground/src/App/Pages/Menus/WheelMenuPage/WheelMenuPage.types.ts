import type { AccessorProps, ArcDefs, WheelMenuItem } from "@thewaver/ss-components";

export type WheelAction = {
    name: string;
    shortcut?: string;
};

export type WheelMenuExampleProps = AccessorProps<{
    caption: string;
    spreadDegrees?: number;
}> & {
    items: WheelMenuItem<WheelAction>[];
    layoutDefs?: ArcDefs;
    onActivate: (action: WheelAction) => void;
};
