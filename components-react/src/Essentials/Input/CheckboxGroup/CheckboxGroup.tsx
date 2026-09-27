import { useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    CHECKBOX_GROUP_DEFAULTS,
    type CheckboxGroupController,
    type CheckboxGroupEntry,
    CheckboxGroupStyles,
    CheckboxGroupUtils,
    type CheckedState,
} from "@thewaver/ss-components";

import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useLatest } from "../../../Utils/refUtils";
import { CheckboxGroupContextProvider } from "./CheckboxGroup.context";
import type { CheckboxGroupReactContextType } from "./CheckboxGroup.context.types";
import type { CheckboxGroupProps } from "./CheckboxGroup.types";

export const CheckboxGroup = <T,>(props: CheckboxGroupProps<T>) => {
    const [values, setValues] = SignalMirrorReactUtils.useOptionalState<T[]>(props.valueState, []);

    const latest = useLatest({ values, setValues, onMount: props.onMount });
    const handedStateRef = useRef<CheckedState | undefined>(undefined);

    const [entries] = useState((): CheckboxGroupEntry[] => []);

    const [registry] = useState(() => ({
        setIsChecked: (value: unknown, isChecked: boolean) => {
            const current = latest.current.values;

            if (current.includes(value as T) === isChecked) return;

            latest.current.setValues(CheckboxGroupUtils.toggleValue(current, value as T, isChecked));
        },
        register: (entry: CheckboxGroupEntry) => {
            entries.push(entry);

            return () => {
                const index = entries.indexOf(entry);

                if (index >= 0) entries.splice(index, 1);
            };
        },
    }));

    const context = useMemo(
        (): CheckboxGroupReactContextType => ({
            ...registry,
            computeIsChecked: (value) => values.includes(value as T),
        }),
        [registry, values],
    );

    useLayoutEffect(() => {
        const checkedState = CheckboxGroupUtils.computeCheckedState(latest.current.values, entries);

        if (checkedState === handedStateRef.current) return;

        handedStateRef.current = checkedState;

        const controller: CheckboxGroupController = {
            getCheckedState: () => CheckboxGroupUtils.computeCheckedState(latest.current.values, entries),
            setIsEveryChecked: (isChecked) => {
                const current = latest.current.values;
                const changedValues = CheckboxGroupUtils.computeChangedValues(current, entries, isChecked);

                if (changedValues.length < 1) return false;

                latest.current.setValues(CheckboxGroupUtils.applyChangedValues(current, changedValues, isChecked));

                return true;
            },
        };

        latest.current.onMount?.(controller);
    });

    return (
        <div
            className={CheckboxGroupStyles.checkboxGroupRoot}
            style={{
                flexDirection:
                    (props.orientation ?? CHECKBOX_GROUP_DEFAULTS.orientation) === "horizontal" ? "row" : "column",
                gap: `${props.gap ?? CHECKBOX_GROUP_DEFAULTS.gap}px`,
            }}
            role="group"
            aria-label={props.ariaLabel}
        >
            <CheckboxGroupContextProvider value={context}>{props.children}</CheckboxGroupContextProvider>
        </div>
    );
};
