import { type SlotsType, computed, defineComponent } from "vue";

import { SelectUtils, SelectionUtils } from "@thewaver/ss-components";

import { declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { SelectComposite } from "../Select/Select";
import type { SelectCompositeSlots } from "../Select/Select.types";
import type { MultiSelectProps, MultiSelectSlots } from "./MultiSelect.types";

export const MultiSelect = defineComponent(
    <T,>(props: MultiSelectProps<T>, { slots }: SlotsContext<MultiSelectSlots<T>>) => {
        const values = useTwoWay(props, "values");
        const visibility = useTwoWay(props, "visibility", false);
        const query = useTwoWay(props, "query", undefined, { keepsOwnValue: false });

        const selectedOptions = computed(() =>
            SelectUtils.getFlatOptions(props.options).filter((option) => values.value.includes(option.value)),
        );

        return () => (
            <SelectComposite
                {...{
                    ...forwardProps(props, SelectComposite),
                    "visibility": visibility.value,
                    "onUpdate:visibility": (isOpen: boolean) => {
                        visibility.value = isOpen;
                    },
                    "query": query.value,
                    "onUpdate:query": (next: string) => {
                        query.value = next;
                    },
                }}
                options={props.options}
                isMultiple={true}
                selectedOptions={selectedOptions.value}
                computeIsSelected={(value: T) => values.value.includes(value)}
                onPick={(value: T) => {
                    const nextValues = SelectionUtils.getToggled(values.value, value);

                    values.value = nextValues;

                    props.onSelectionChange?.(nextValues);
                }}
                onClear={() => {
                    if (values.value.length < 1) return;

                    values.value = [];

                    props.onSelectionChange?.([]);
                }}
            >
                {
                    {
                        renderContent: slots.renderContent,
                        renderPopup: slots.renderPopup,
                        renderClear: slots.renderClear,
                        renderOption: slots.renderOption,
                        renderGroup: slots.renderGroup,
                        renderSelectionFloater: slots.renderSelectionFloater,
                        renderHighlightFloater: slots.renderHighlightFloater,
                        renderDecoration: slots.renderDecoration,
                    } satisfies Partial<SelectCompositeSlots<T>>
                }
            </SelectComposite>
        );
    },
    {
        name: "MultiSelect",
        slots: Object as SlotsType<MultiSelectSlots<any>>,
        props: declareProps<MultiSelectProps<unknown>>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "sizing": null,
            "minWidth": null,
            "minHeight": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "id": null,
            "ariaLabel": null,
            "listAriaLabel": null,
            "isRequired": Boolean,
            "placement": null,
            "offset": null,
            "reservedScreenSize": null,
            "transitionDurationMs": null,
            "padding": null,
            "hasMoreOptions": Boolean,
            "computeTextStyle": null,
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "query": null,
            "onUpdate:query": null,
            "computeEstimatedOptionHeight": null,
            "computeEstimatedGroupHeight": null,
            "floaterTransitionDurationMs": null,
            "onReachEnd": null,
            "clearAriaLabel": null,
            "options": null,
            "computeCustomText": null,
            "values": null,
            "onUpdate:values": null,
            "onSelectionChange": null,
        }),
    },
);
