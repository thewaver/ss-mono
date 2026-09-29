import { createMemo } from "solid-js";

import { SelectUtils, SelectionUtils } from "@thewaver/ss-components";

import { access, accessSignal } from "../../../Utils/propUtils";
import { ListboxComposite } from "../Listbox/Listbox";
import type { MultiListboxProps } from "./MultiListboxSolid.types";

export const MultiListbox = <T,>(props: MultiListboxProps<T>) => {
    const valuesSignal = accessSignal(() => props.values);

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
