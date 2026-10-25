import { createEffect, createMemo, createSignal } from "solid-js";

import { Checkbox } from "@thewaver/ss-components-solid";

import { PageControlRow, PageControlRowLabel } from "../../../PageComponents/ControlRow/ControlRow";
import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

export const MixedDocsExample = () => {
    const allSignal = createSignal(false);
    const firstSignal = createSignal(true);
    const secondSignal = createSignal(false);

    const getIsMixed = createMemo(() => firstSignal[0]() !== secondSignal[0]());

    createEffect(() => {
        allSignal[1](firstSignal[0]() && secondSignal[0]());
    });

    return (
        <PageControlRow>
            <Checkbox
                checked={allSignal}
                isMixed={getIsMixed}
                id={"selectAll"}
                ariaLabel={"Select all"}
                renderContent={(getFlags) => <PageCheckboxContent flags={getFlags}>Select all</PageCheckboxContent>}
                onChange={(isChecked) => {
                    firstSignal[1](isChecked);
                    secondSignal[1](isChecked);
                }}
            />

            <PageControlRowLabel>controls</PageControlRowLabel>

            <Checkbox
                checked={firstSignal}
                id={"firstChild"}
                ariaLabel={"First child"}
                renderContent={(getFlags) => <PageCheckboxContent flags={getFlags}>First child</PageCheckboxContent>}
            />

            <Checkbox
                checked={secondSignal}
                ariaLabel={"Second child"}
                renderContent={(getFlags) => <PageCheckboxContent flags={getFlags}>Second child</PageCheckboxContent>}
            />
        </PageControlRow>
    );
};
