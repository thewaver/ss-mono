import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";
import type { Color } from "@thewaver/ss-utils";

export type ColorAreaExampleProps = AccessorProps<{
    isDisabled?: boolean;
    hsvSignal: Signal<Color.HSVA>;
}>;

export type ColorAreaDropdownExampleProps = ColorAreaExampleProps &
    AccessorProps<{
        popupId: string;
        isOpenSignal: Signal<boolean>;
        hueSignal: Signal<number>;
    }>;
