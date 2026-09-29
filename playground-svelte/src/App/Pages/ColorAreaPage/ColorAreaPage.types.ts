import type { Color } from "@thewaver/ss-utils";

export type ColorAreaExampleProps = {
    isDisabled?: boolean;
    hsv: Color.HSVA;
};

export type ColorAreaDropdownExampleProps = ColorAreaExampleProps & {
    popupId: string;
    isOpen: boolean;
    hue: number;
};
