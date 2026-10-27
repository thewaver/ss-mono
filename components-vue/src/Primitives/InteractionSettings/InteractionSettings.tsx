import { type SlotsType, computed, defineComponent } from "vue";

import { InteractionSettingsUtils } from "@thewaver/ss-components";

import { declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { provideInteractionSettingsContext, useInteractionSettingsContext } from "./InteractionSettings.context";
import type { InteractionSettingsProps, InteractionSettingsSlots } from "./InteractionSettings.types";

export const InteractionSettings = defineComponent(
    (props: InteractionSettingsProps, { slots }: SlotsContext<InteractionSettingsSlots>) => {
        const parent = useInteractionSettingsContext();

        const settings = computed(() =>
            InteractionSettingsUtils.merge(parent.getSettings(), { toastHotkeys: props.toastHotkeys }),
        );

        provideInteractionSettingsContext({ getSettings: () => settings.value });

        return () => slots.default?.();
    },
    {
        name: "InteractionSettings",
        slots: Object as SlotsType<InteractionSettingsSlots>,
        props: declareProps<InteractionSettingsProps>({
            toastHotkeys: null,
        }),
    },
);
