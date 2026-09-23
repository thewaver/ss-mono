import { createMemo } from "solid-js";

import { SelectionUtils } from "../../../Abstracts/Selection/Selection.utils";
import { access, accessSignal } from "../../../Utils/propUtils";
import { ListboxComposite } from "../Listbox/Listbox";
import { SelectUtils } from "../Select/Select.utils";
import type { MultiListboxProps } from "./MultiListbox.types";

export const MultiListbox = <T,>(props: MultiListboxProps<T>) => {
    const valuesSignal = accessSignal(() => props.valuesSignal);

    const getSelectedOptions = createMemo(() => {
        const selectedValues = valuesSignal[0]();

        return SelectUtils.getFlatOptions(access(props.options)).filter((option) =>
            selectedValues.includes(option.value),
        );
    });

    return (
        <ListboxComposite
            {...props}
            isMultiple={true}
            selectedOptions={getSelectedOptions}
            computeIsSelected={(value) => valuesSignal[0]().includes(value)}
            onPick={(value) => {
                const nextValues = SelectionUtils.getToggled(valuesSignal[0](), value);

                valuesSignal[1](() => nextValues);

                void props.onSelectionChange?.(nextValues);
            }}
        />
    );
};
