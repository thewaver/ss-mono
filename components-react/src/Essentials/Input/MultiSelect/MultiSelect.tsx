import { useMemo } from "react";

import { SelectUtils, SelectionUtils } from "@thewaver/ss-components";

import { SelectComposite } from "../Select/Select";
import type { MultiSelectProps } from "./MultiSelect.types";

export const MultiSelect = <T,>(props: MultiSelectProps<T>) => {
    const [values, setValues] = props.valuesState;

    const selectedOptions = useMemo(
        () => SelectUtils.getFlatOptions(props.options).filter((option) => values.includes(option.value)),
        [props.options, values],
    );

    return (
        <SelectComposite
            {...props}
            isMultiple={true}
            selectedOptions={selectedOptions}
            computeIsSelected={(value) => values.includes(value)}
            renderContent={props.renderContent}
            onPick={(value) => {
                const nextValues = SelectionUtils.getToggled(values, value);

                setValues(nextValues);

                props.onSelectionChange?.(nextValues);
            }}
            onClear={() => {
                if (values.length < 1) return;

                setValues([]);

                props.onSelectionChange?.([]);
            }}
        />
    );
};
