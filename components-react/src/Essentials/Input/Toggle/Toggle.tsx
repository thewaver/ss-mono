import { BinarySwitch } from "../../../Primitives/BinarySwitch/BinarySwitch";
import type { ToggleProps } from "./Toggle.types";

export const Toggle = (props: ToggleProps) => (
    <BinarySwitch
        {...props}
        type={"checkbox"}
        isSwitch={true}
        isChecked={props.checkedState[0]}
        onChange={(isChecked) => {
            props.checkedState[1](isChecked);

            props.onChange?.(isChecked);
        }}
    />
);
