import { useState } from "react";

import { MultiListbox } from "../../src";
import { GROUPED_COUNTRIES, GroupContent, OptionContent, Surface } from "./ListboxFixtures";

export const Grouped = () => {
    const valuesState = useState<string[]>(["Denmark"]);

    return (
        <>
            <Surface>
                <MultiListbox
                    valuesState={valuesState}
                    options={GROUPED_COUNTRIES}
                    ariaLabel={"Countries to ship to"}
                    renderGroup={(group, flags) => <GroupContent flags={flags}>{group.label}</GroupContent>}
                    renderOption={(option, flags) => <OptionContent flags={flags}>{option.value}</OptionContent>}
                />
            </Surface>
            <output data-readout="values">{`values: [${valuesState[0].join(", ")}]`}</output>
        </>
    );
};
