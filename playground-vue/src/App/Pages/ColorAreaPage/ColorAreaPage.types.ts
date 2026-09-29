import type { Color } from "@thewaver/ss-utils";

export type ColorAreaExampleProps = {
    "isDisabled"?: boolean;
    "hsv": Color.HSVA;
    "onUpdate:hsv"?: (hsv: Color.HSVA) => void;
};

export type ColorAreaDropdownExampleProps = ColorAreaExampleProps & {
    "popupId": string;
    "isOpen": boolean;
    "onUpdate:isOpen"?: (isOpen: boolean) => void;
    "hue": number;
    "onUpdate:hue"?: (hue: number) => void;
};
