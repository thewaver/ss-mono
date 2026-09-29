import { useMemo } from "react";

import { SelectUtils, SelectionUtils } from "@thewaver/ss-components";

import { ListboxComposite } from "../Listbox/Listbox";
import type { MultiListboxProps } from "./MultiListbox.types";

export const MultiListbox = <T,>(props: MultiListboxProps<T>) => {
    const [values, setValues] = props.values;

    const selectedOptions = useMemo(
        () => SelectUtils.getFlatOptions(props.options).filter((option) => values.includes(option.value)),
        [props.options, values],
    );

    return (
        <ListboxComposite
            {...props}
            isMultiple={true}
            selectedOptions={selectedOptions}
            computeIsSelected={(value) => values.includes(value)}
            onPick={(value) => {
                const nextValues = SelectionUtils.getToggled(values, value);

                setValues(nextValues);

                props.onSelectionChange?.(nextValues);
            }}
        />
    );
};
