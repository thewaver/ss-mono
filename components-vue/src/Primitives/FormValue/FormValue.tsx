import { defineComponent } from "vue";

import { declareProps } from "../../Utils/propUtils";
import type { FormValueProps } from "./FormValue.types";

export const FormValue = defineComponent(
    (props: FormValueProps) => () =>
        props.name ? (
            <>
                {props.values.map((value, index) => (
                    <input key={index} type="hidden" name={props.name} value={value} />
                ))}
            </>
        ) : null,
    {
        name: "FormValue",
        props: declareProps<FormValueProps>({ name: null, values: null }),
    },
);
