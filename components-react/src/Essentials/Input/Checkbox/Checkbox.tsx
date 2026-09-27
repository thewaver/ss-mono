import { useLayoutEffect, useState } from "react";

import type { CheckboxGroupEntry } from "@thewaver/ss-components";

import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { BinarySwitch } from "../../../Primitives/BinarySwitch/BinarySwitch";
import { useLatest } from "../../../Utils/refUtils";
import { useCheckboxGroupContext } from "../CheckboxGroup/CheckboxGroup.context";
import type { CheckboxProps } from "./Checkbox.types";

export const Checkbox = <T,>(props: CheckboxProps<T>) => {
    const groupContext = useCheckboxGroupContext();
    const group = props.value === undefined ? undefined : groupContext;

    const [isOwnChecked, setIsOwnChecked] = SignalMirrorReactUtils.useOptionalState(props.checkedState, false);

    const latest = useLatest({ value: props.value, isDisabled: props.isDisabled ?? false });

    const [entry] = useState((): CheckboxGroupEntry => ({
        getValue: () => latest.current.value,
        getIsDisabled: () => latest.current.isDisabled,
    }));

    const register = group?.register;

    useLayoutEffect(() => register?.(entry), [register, entry]);

    return (
        <BinarySwitch
            {...props}
            type={"checkbox"}
            isChecked={group ? group.computeIsChecked(props.value) : isOwnChecked}
            onChange={(isChecked) => {
                if (group) group.setIsChecked(props.value, isChecked);
                else setIsOwnChecked(isChecked);

                props.onChange?.(isChecked);
            }}
        />
    );
};
