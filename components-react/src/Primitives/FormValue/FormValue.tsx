import type { FormValueProps } from "./FormValue.types";

export const FormValue = (props: FormValueProps) => {
    if (!props.name) return null;

    return (
        <>
            {props.values.map((value, index) => (
                <input key={index} type="hidden" name={props.name} value={value} />
            ))}
        </>
    );
};
