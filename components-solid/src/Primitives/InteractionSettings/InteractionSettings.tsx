import type { ParentProps } from "solid-js";
import { createMemo } from "solid-js";

import { InteractionSettingsUtils } from "@thewaver/ss-components";

import { access } from "../../Utils/propUtils";
import { InteractionSettingsContextProvider, useInteractionSettingsContext } from "./InteractionSettings.context";
import type { InteractionSettingsProps } from "./InteractionSettingsSolid.types";

/**
 * Changes how the library behaves for everything inside it, and wraps nothing visible.
 *
 * Wrappers nest: one inside another keeps the settings it does not set and replaces the ones it does.
 */
export const InteractionSettings = (props: ParentProps<InteractionSettingsProps>) => {
    const parent = useInteractionSettingsContext();

    const getSettings = createMemo(() =>
        InteractionSettingsUtils.merge(parent.getSettings(), { toastHotkeys: access(props.toastHotkeys) }),
    );

    return (
        <InteractionSettingsContextProvider value={{ getSettings }}>
            {props.children}
        </InteractionSettingsContextProvider>
    );
};
