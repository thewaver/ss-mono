import { type SlotsType, defineComponent, shallowRef } from "vue";

import {
    CHECKBOX_GROUP_DEFAULTS,
    type CheckboxGroupController,
    type CheckboxGroupEntry,
    CheckboxGroupStyles,
    CheckboxGroupUtils,
} from "@thewaver/ss-components";

import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { provideCheckboxGroupContext } from "./CheckboxGroup.context";
import type { CheckboxGroupProps, CheckboxGroupSlots } from "./CheckboxGroup.types";

export const CheckboxGroup = defineComponent(
    <T,>(props: CheckboxGroupProps<T>, { slots }: SlotsContext<CheckboxGroupSlots>) => {
        const values = useTwoWay(props, "value", []);

        const entries = shallowRef<CheckboxGroupEntry[]>([]);

        const computeIsChecked = (value: unknown) => values.value.includes(value as T);

        const controller: CheckboxGroupController = {
            getCheckedState: () => CheckboxGroupUtils.computeCheckedState(values.value, entries.value),
            setIsEveryChecked: (isChecked) => {
                const changedValues = CheckboxGroupUtils.computeChangedValues(values.value, entries.value, isChecked);

                if (changedValues.length < 1) return false;

                values.value = CheckboxGroupUtils.applyChangedValues(values.value, changedValues, isChecked);

                return true;
            },
        };

        provideCheckboxGroupContext({
            computeIsChecked,
            setIsChecked: (value, isChecked) => {
                if (computeIsChecked(value) === isChecked) return;

                values.value = CheckboxGroupUtils.toggleValue(values.value, value as T, isChecked);
            },
            register: (entry) => {
                entries.value = [...entries.value, entry];

                return () => {
                    entries.value = entries.value.filter((held) => held !== entry);
                };
            },
        });

        watchAfterRender([], () => {
            props.onMount?.(controller);
        });

        return () => (
            <div
                class={CheckboxGroupStyles.checkboxGroupRoot}
                style={{
                    flexDirection:
                        (props.orientation ?? CHECKBOX_GROUP_DEFAULTS.orientation) === "horizontal" ? "row" : "column",
                    gap: `${props.gap ?? CHECKBOX_GROUP_DEFAULTS.gap}px`,
                }}
                role="group"
                aria-label={props.ariaLabel}
            >
                {slots.default?.()}
            </div>
        );
    },
    {
        name: "CheckboxGroup",
        slots: Object as SlotsType<CheckboxGroupSlots>,
        props: declareProps<CheckboxGroupProps<unknown>>({
            "ariaLabel": null,
            "orientation": null,
            "gap": null,
            "value": null,
            "onUpdate:value": null,
            "onMount": null,
        }),
    },
);
