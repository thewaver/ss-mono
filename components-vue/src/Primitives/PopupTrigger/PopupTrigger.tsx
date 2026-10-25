import { type SlotsType, defineComponent } from "vue";

import { type PopupTriggerFlags, PopupTriggerStyles } from "@thewaver/ss-components";

import { callSlot, declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { InteractionControlSlots } from "../InteractionWrapper/InteractionWrapper.types";
import type { PopupTriggerProps } from "./PopupTrigger.types";

export const PopupTrigger = defineComponent(
    (props: PopupTriggerProps, { slots }: SlotsContext<InteractionControlSlots<PopupTriggerFlags>>) => {
        return () => {
            const isDisabled = props.flags.isDisabled ?? false;

            return (
                <button
                    id={props.id}
                    type="button"
                    class={PopupTriggerStyles.popupTrigger}
                    aria-label={props.ariaLabel}
                    aria-haspopup="dialog"
                    aria-expanded={props.isOpen}
                    aria-controls={props.isOpen ? props.popupId : undefined}
                    aria-disabled={isDisabled || undefined}
                    onClick={() => {
                        if (isDisabled) return;

                        props.onToggle();
                    }}
                >
                    {callSlot(slots.renderContent, props.flags)}
                </button>
            );
        };
    },
    {
        name: "PopupTrigger",
        slots: Object as SlotsType<InteractionControlSlots<PopupTriggerFlags>>,
        props: declareProps<PopupTriggerProps>({
            id: null,
            ariaLabel: null,
            flags: null,
            popupId: null,
            isOpen: Boolean,
            onToggle: null,
        }),
    },
);
