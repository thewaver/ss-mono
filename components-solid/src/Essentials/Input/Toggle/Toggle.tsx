import { BinarySwitch } from "../../../Primitives/BinarySwitch/BinarySwitch";
import type { ToggleProps } from "./ToggleSolid.types";

export const Toggle = (props: ToggleProps) => {
    return (
        <BinarySwitch
            {...props}
            type={"checkbox"}
            isSwitch={true}
            isChecked={() => props.checked[0]()}
            onChange={(isChecked) => {
                props.checked[1](isChecked);

                void props.onChange?.(isChecked);
            }}
        />
    );
};
