import { useState } from "react";

import { Checkbox } from "@thewaver/ss-components-react";

import { PageControlRow, PageControlRowLabel } from "../../../PageComponents/ControlRow/ControlRow";
import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

export const RefusingDocsExample = () => {
    const emailState = useState(true);
    const smsState = useState(false);

    return (
        <PageControlRow>
            <Checkbox
                checked={emailState}
                id={"email"}
                ariaLabel={"Email"}
                renderContent={(flags) => <PageCheckboxContent flags={flags}>Email</PageCheckboxContent>}
                onChange={(isChecked) => {
                    if (isChecked || smsState[0]) return;

                    emailState[1](true);
                }}
            />

            <PageControlRowLabel>or</PageControlRowLabel>

            <Checkbox
                checked={smsState}
                ariaLabel={"SMS"}
                renderContent={(flags) => <PageCheckboxContent flags={flags}>SMS</PageCheckboxContent>}
                onChange={(isChecked) => {
                    if (isChecked || emailState[0]) return;

                    smsState[1](true);
                }}
            />
        </PageControlRow>
    );
};
