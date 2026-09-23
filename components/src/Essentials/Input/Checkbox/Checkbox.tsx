import { SignalMirrorUtils } from "../../../Abstracts/SignalMirror/SignalMirror.utils";
import { BinarySwitch } from "../../../Primitives/BinarySwitch/BinarySwitch";
import { access } from "../../../Utils/propUtils";
import { useCheckboxGroupContext } from "../CheckboxGroup/CheckboxGroup.context";
import type { CheckboxProps } from "./Checkbox.types";

export const Checkbox = <T,>(props: CheckboxProps<T>) => {
    const group = props.value === undefined ? undefined : useCheckboxGroupContext();

    const checkedSignal = SignalMirrorUtils.createOptional(() => props.checkedSignal, false);

    const getValue = () => access(props.value) as unknown;

    group?.register({
        getValue,
        getIsDisabled: () => access(props.isDisabled) ?? false,
    });

    return (
        <BinarySwitch
            {...props}
            type={"checkbox"}
            isChecked={() => (group ? group.computeIsChecked(getValue()) : checkedSignal[0]())}
            onChange={(isChecked) => {
                if (group) group.setIsChecked(getValue(), isChecked);
                else checkedSignal[1](isChecked);

                void props.onChange?.(isChecked);
            }}
        />
    );
};
