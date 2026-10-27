import type { ParentProps } from "solid-js";
import { createMemo } from "solid-js";

import { InteractionSettingsUtils } from "@thewaver/ss-components";

import { access } from "../../Utils/propUtils";
import { InteractionSettingsContextProvider, useInteractionSettingsContext } from "./InteractionSettings.context";
import type { InteractionSettingsProps } from "./InteractionSettingsSolid.types";

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
