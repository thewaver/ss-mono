import { useEffect, useState } from "react";

import { Toggle } from "@thewaver/ss-components-react";

import { PageControlRow, PageControlRowLabel } from "../../../PageComponents/ControlRow/ControlRow";
import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";

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
            <Toggle
                checked={allState}
                isMixed={isMixed}
                id={"allSettings"}
                ariaLabel={"All settings"}
                renderContent={(flags) => <PageToggleContent flags={flags}>All settings</PageToggleContent>}
                onChange={(isChecked) => {
                    setIsFirstChecked(isChecked);
                    setIsSecondChecked(isChecked);
                }}
            />

            <PageControlRowLabel>controls</PageControlRowLabel>

            <Toggle
                checked={firstState}
                id={"firstSetting"}
                ariaLabel={"First setting"}
                renderContent={(flags) => <PageToggleContent flags={flags}>First setting</PageToggleContent>}
            />

            <Toggle
                checked={secondState}
                ariaLabel={"Second setting"}
                renderContent={(flags) => <PageToggleContent flags={flags}>Second setting</PageToggleContent>}
            />
        </PageControlRow>
    );
};
