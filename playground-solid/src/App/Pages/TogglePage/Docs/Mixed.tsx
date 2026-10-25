import { createEffect, createMemo, createSignal } from "solid-js";

import { Toggle } from "@thewaver/ss-components-solid";

import { PageControlRow, PageControlRowLabel } from "../../../PageComponents/ControlRow/ControlRow";
import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";

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
            <Toggle
                checked={allSignal}
                isMixed={getIsMixed}
                id={"allSettings"}
                ariaLabel={"All settings"}
                renderContent={(getFlags) => <PageToggleContent flags={getFlags}>All settings</PageToggleContent>}
                onChange={(isChecked) => {
                    firstSignal[1](isChecked);
                    secondSignal[1](isChecked);
                }}
            />

            <PageControlRowLabel>controls</PageControlRowLabel>

            <Toggle
                checked={firstSignal}
                id={"firstSetting"}
                ariaLabel={"First setting"}
                renderContent={(getFlags) => <PageToggleContent flags={getFlags}>First setting</PageToggleContent>}
            />

            <Toggle
                checked={secondSignal}
                ariaLabel={"Second setting"}
                renderContent={(getFlags) => <PageToggleContent flags={getFlags}>Second setting</PageToggleContent>}
            />
        </PageControlRow>
    );
};
