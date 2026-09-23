import { createMemo } from "solid-js";

import { SelectionUtils } from "../../../Abstracts/Selection/Selection.utils";
import { access, accessSignal } from "../../../Utils/propUtils";
import { SelectComposite } from "../Select/Select";
import { SelectUtils } from "../Select/Select.utils";
import type { MultiSelectProps } from "./MultiSelect.types";

export const MultiSelect = <T,>(props: MultiSelectProps<T>) => {
    const valuesSignal = accessSignal(() => props.valuesSignal);

    const getSelectedOptions = createMemo(() => {
        const selectedValues = valuesSignal[0]();

        return SelectUtils.getFlatOptions(access(props.options)).filter((option) =>
            selectedValues.includes(option.value),
        );
    });

    return (
        <SelectComposite
            {...props}
            isMultiple={true}
            selectedOptions={getSelectedOptions}
            computeIsSelected={(value) => valuesSignal[0]().includes(value)}
            renderContent={props.renderContent}
            onPick={(value) => {
                const nextValues = SelectionUtils.getToggled(valuesSignal[0](), value);

                valuesSignal[1](() => nextValues);

                void props.onSelectionChange?.(nextValues);
            }}
            onClear={() => {
                if (valuesSignal[0]().length < 1) return;

                valuesSignal[1](() => []);

                void props.onSelectionChange?.([]);
            }}
        />
    );
};
