import { createSignal } from "solid-js";

import { Checkbox } from "@thewaver/ss-components-solid";

import { PageControlRow, PageControlRowLabel } from "../../../PageComponents/ControlRow/ControlRow";
import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

export const RefusingDocsExample = () => {
    const emailSignal = createSignal(true);
    const smsSignal = createSignal(false);

    return (
        <PageControlRow>
            <Checkbox
                checked={emailSignal}
                id={"email"}
                ariaLabel={"Email"}
                renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
                onChange={(isChecked) => {
                    if (isChecked || smsSignal[0]()) return;

                    emailSignal[1](true);
                }}
            />

            <PageControlRowLabel>or</PageControlRowLabel>

            <Checkbox
                checked={smsSignal}
                ariaLabel={"SMS"}
                renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
                onChange={(isChecked) => {
                    if (isChecked || emailSignal[0]()) return;

                    smsSignal[1](true);
                }}
            />
        </PageControlRow>
    );
};
