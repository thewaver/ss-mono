import { createSignal, onCleanup, onMount, untrack } from "solid-js";

import {
    CHECKBOX_GROUP_DEFAULTS,
    type CheckboxGroupContextType,
    type CheckboxGroupController,
    type CheckboxGroupEntry,
    CheckboxGroupUtils,
    CheckboxGroupStyles as styles,
} from "@thewaver/ss-components";

import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../../Utils/propUtils";
import { CheckboxGroupContextProvider } from "./CheckboxGroup.context";
import type { CheckboxGroupProps } from "./CheckboxGroupSolid.types";

export const CheckboxGroup = <T,>(props: CheckboxGroupProps<T>) => {
    const [getValues, setValues] = SignalMirrorSolidUtils.createOptional<T[]>(() => props.value, []);

    const [getEntries, setEntries] = createSignal<CheckboxGroupEntry[]>([]);

    const computeIsChecked = (value: unknown) => getValues().includes(value as T);

    const setIsChecked = (value: unknown, isChecked: boolean) => {
        if (computeIsChecked(value) === isChecked) return;

        setValues((prev) => CheckboxGroupUtils.toggleValue(prev, value as T, isChecked));
    };

    const controller: CheckboxGroupController = {
        getCheckedState: () => CheckboxGroupUtils.computeCheckedState(getValues(), getEntries()),
        setIsEveryChecked: (isChecked) => {
            const changedValues = untrack(() =>
                CheckboxGroupUtils.computeChangedValues(getValues(), getEntries(), isChecked),
            );

            if (changedValues.length < 1) return false;

            setValues((prev) => CheckboxGroupUtils.applyChangedValues(prev, changedValues, isChecked));

            return true;
        },
    };

    const context: CheckboxGroupContextType = {
        computeIsChecked,
        setIsChecked,
        register: (entry) => {
            setEntries((prev) => [...prev, entry]);

            onCleanup(() => {
                setEntries((prev) => prev.filter((held) => held !== entry));
            });
        },
    };

    onMount(() => {
        props.onMount?.(controller);
    });

    return (
        <div
            class={styles.checkboxGroupRoot}
            style={{
                "flex-direction":
                    (access(props.orientation) ?? CHECKBOX_GROUP_DEFAULTS.orientation) === "horizontal"
                        ? "row"
                        : "column",
                "gap": `${access(props.gap) ?? CHECKBOX_GROUP_DEFAULTS.gap}px`,
            }}
            role="group"
            aria-label={access(props.ariaLabel)}
        >
            <CheckboxGroupContextProvider value={context}>{props.children}</CheckboxGroupContextProvider>
        </div>
    );
};
