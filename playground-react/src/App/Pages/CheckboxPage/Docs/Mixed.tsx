import { useEffect, useState } from "react";

import { Checkbox } from "@thewaver/ss-components-react";

import { PageControlRow, PageControlRowLabel } from "../../../PageComponents/ControlRow/ControlRow";
import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

export const MixedDocsExample = () => {
    const allState = useState(false);
    const firstState = useState(true);
    const secondState = useState(false);

    const [, setAll] = allState;
    const [isFirstChecked, setIsFirstChecked] = firstState;
    const [isSecondChecked, setIsSecondChecked] = secondState;

    const isMixed = isFirstChecked !== isSecondChecked;

    useEffect(() => {
        setAll(isFirstChecked && isSecondChecked);
    }, [isFirstChecked, isSecondChecked]);

    return (
        <PageControlRow>
            <Checkbox
                checked={allState}
                isMixed={isMixed}
                id={"selectAll"}
                ariaLabel={"Select all"}
                renderContent={(flags) => <PageCheckboxContent flags={flags}>Select all</PageCheckboxContent>}
                onChange={(isChecked) => {
                    setIsFirstChecked(isChecked);
                    setIsSecondChecked(isChecked);
                }}
            />

            <PageControlRowLabel>controls</PageControlRowLabel>

            <Checkbox
                checked={firstState}
                id={"firstChild"}
                ariaLabel={"First child"}
                renderContent={(flags) => <PageCheckboxContent flags={flags}>First child</PageCheckboxContent>}
            />

            <Checkbox
                checked={secondState}
                ariaLabel={"Second child"}
                renderContent={(flags) => <PageCheckboxContent flags={flags}>Second child</PageCheckboxContent>}
            />
        </PageControlRow>
    );
};
