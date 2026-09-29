import { type SlotsType, computed, defineComponent } from "vue";

import { SelectUtils, SelectionUtils } from "@thewaver/ss-components";

import { declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { ListboxComposite } from "../Listbox/Listbox";
import type { ListboxCompositeSlots } from "../Listbox/Listbox.types";
import type { MultiListboxProps, MultiListboxSlots } from "./MultiListbox.types";

export const MultiListbox = defineComponent(
    <T,>(props: MultiListboxProps<T>, { slots }: SlotsContext<MultiListboxSlots<T>>) => {
        const values = useTwoWay(props, "values");

        const selectedOptions = computed(() =>
            SelectUtils.getFlatOptions(props.options).filter((option) => values.value.includes(option.value)),
        );

        return () => (
            <ListboxComposite
                {...forwardProps(props, ListboxComposite)}
                options={props.options}
                ariaLabel={props.ariaLabel}
                isMultiple={true}
                selectedOptions={selectedOptions.value}
                computeIsSelected={(value: T) => values.value.includes(value)}
                onPick={(value: T) => {
                    const nextValues = SelectionUtils.getToggled(values.value, value);

                    values.value = nextValues;

                    props.onSelectionChange?.(nextValues);
                }}
            >
                {
                    {
                        renderOption: slots.renderOption,
                        renderGroup: slots.renderGroup,
                    } satisfies Partial<ListboxCompositeSlots<T>>
                }
            </ListboxComposite>
        );
    },
    {
        name: "MultiListbox",
        slots: Object as SlotsType<MultiListboxSlots<any>>,
        props: declareProps<MultiListboxProps<unknown>>({
            "id": null,
            "ariaLabel": null,
            "isDisabled": Boolean,
            "orientation": null,
            "hasMoreOptions": Boolean,
            "onReachEnd": null,
            "computeEstimatedOptionHeight": null,
            "computeEstimatedGroupHeight": null,
            "options": null,
            "computeCustomText": null,
            "values": null,
            "onUpdate:values": null,
            "onSelectionChange": null,
        }),
    },
);
