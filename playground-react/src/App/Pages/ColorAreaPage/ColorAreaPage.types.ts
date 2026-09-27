import type { Color } from "@thewaver/ss-utils";

export type ColorAreaExampleProps = {
    isDisabled?: boolean;
    hsvState: readonly [Color.HSVA, (hsv: Color.HSVA) => void];
};

export type ColorAreaDropdownExampleProps = ColorAreaExampleProps & {
    popupId: string;
    isOpenState: readonly [boolean, (isOpen: boolean) => void];
    hueState: readonly [number, (hue: number) => void];
};
