import type { Color } from "@thewaver/ss-utils";

export type ColorAreaExampleProps = {
    isDisabled?: boolean;
    hsv: readonly [Color.HSVA, (hsv: Color.HSVA) => void];
};

export type ColorAreaDropdownExampleProps = ColorAreaExampleProps & {
    popupId: string;
    isOpen: readonly [boolean, (isOpen: boolean) => void];
    hue: readonly [number, (hue: number) => void];
};
