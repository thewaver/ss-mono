import { createMemo, createSignal, onCleanup, onMount, untrack } from "solid-js";

import { CheckedStateUtils } from "../../../Abstracts/CheckedState/CheckedState.utils";
import { SignalMirrorUtils } from "../../../Abstracts/SignalMirror/SignalMirror.utils";
import { access } from "../../../Utils/propUtils";
import { CHECKBOX_GROUP_DEFAULTS } from "./CheckboxGroup.const";
import { CheckboxGroupContextProvider } from "./CheckboxGroup.context";
import type { CheckboxGroupContextType, CheckboxGroupEntry } from "./CheckboxGroup.context.types";
import type { CheckboxGroupController, CheckboxGroupProps } from "./CheckboxGroup.types";

import * as styles from "./CheckboxGroup.css";

export const CheckboxGroup = <T,>(props: CheckboxGroupProps<T>) => {
    const [getValues, setValues] = SignalMirrorUtils.createOptional<T[]>(() => props.valueSignal, []);

    const [getEntries, setEntries] = createSignal<CheckboxGroupEntry[]>([]);

    const getCountedEntries = createMemo(() => {
        const entries = getEntries();
        const enabled = entries.filter((entry) => !entry.getIsDisabled());

        return enabled.length > 0 ? enabled : entries;
    });

    const computeIsChecked = (value: unknown) => getValues().includes(value as T);

    const setIsChecked = (value: unknown, isChecked: boolean) => {
        if (computeIsChecked(value) === isChecked) return;

        setValues((prev) => (isChecked ? [...prev, value as T] : prev.filter((held) => held !== value)));
    };

    const controller: CheckboxGroupController = {
        getCheckedState: () =>
            CheckedStateUtils.fromMembers(getCountedEntries().map((entry) => computeIsChecked(entry.getValue()))),
        setIsEveryChecked: (isChecked) => {
            const enabled = untrack(getEntries).filter((entry) => !entry.getIsDisabled());
            const changed = enabled.filter((entry) => untrack(() => computeIsChecked(entry.getValue())) !== isChecked);

            if (changed.length < 1) return false;

            const changedValues = changed.map((entry) => entry.getValue() as T);

            setValues((prev) =>
                isChecked ? [...prev, ...changedValues] : prev.filter((held) => !changedValues.includes(held)),
            );

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
