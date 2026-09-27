import { Checkbox } from "@thewaver/ss-components-react";

import { PageControlRow, PageControlRowLabel } from "../../../PageComponents/ControlRow/ControlRow";
import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import type { CheckboxRefusedWriteExampleProps } from "../CheckboxPage.types";

type Props = CheckboxRefusedWriteExampleProps;

export const RefusedWriteExample = (props: Props) => (
    <PageControlRow>
        <Checkbox
            checkedState={props.emailState}
            id={"email"}
            ariaLabel={"Email"}
            renderContent={(flags) => <PageCheckboxContent flags={flags} />}
            onChange={(isChecked) => {
                if (isChecked || props.smsState[0]) return;

                props.emailState[1](true);
            }}
        />

        <PageControlRowLabel>or</PageControlRowLabel>

        <Checkbox
            checkedState={props.smsState}
            ariaLabel={"SMS"}
            renderContent={(flags) => <PageCheckboxContent flags={flags} />}
            onChange={(isChecked) => {
                if (isChecked || props.emailState[0]) return;

                props.smsState[1](true);
            }}
        />
    </PageControlRow>
);
