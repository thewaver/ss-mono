import { useMemo } from "react";

import { type InteractionSettingsContextType, InteractionSettingsUtils } from "@thewaver/ss-components";

import { InteractionSettingsContextProvider, useInteractionSettingsContext } from "./InteractionSettings.context";
import type { InteractionSettingsProps } from "./InteractionSettings.types";

export const InteractionSettings = (props: InteractionSettingsProps) => {
    const parent = useInteractionSettingsContext();
    const parentSettings = parent.getSettings();

    const context = useMemo<InteractionSettingsContextType>(() => {
        const settings = InteractionSettingsUtils.merge(parentSettings, { toastHotkeys: props.toastHotkeys });

        return { getSettings: () => settings };
    }, [parentSettings, props.toastHotkeys]);

    return <InteractionSettingsContextProvider value={context}>{props.children}</InteractionSettingsContextProvider>;
};
