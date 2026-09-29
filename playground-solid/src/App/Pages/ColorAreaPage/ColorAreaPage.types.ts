import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";
import type { Color } from "@thewaver/ss-utils";

export type ColorAreaExampleProps = AccessorProps<{
    isDisabled?: boolean;
    hsv: Signal<Color.HSVA>;
}>;

export type ColorAreaDropdownExampleProps = ColorAreaExampleProps &
    AccessorProps<{
        popupId: string;
        isOpen: Signal<boolean>;
        hue: Signal<number>;
    }>;
