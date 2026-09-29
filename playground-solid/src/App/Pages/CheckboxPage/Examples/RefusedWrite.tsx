import { Checkbox } from "@thewaver/ss-components-solid";

import { PageControlRow, PageControlRowLabel } from "../../../PageComponents/ControlRow/ControlRow";
import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import type { CheckboxRefusedWriteExampleProps } from "../CheckboxPage.types";

type Props = CheckboxRefusedWriteExampleProps;

export const RefusedWriteExample = (props: Props) => (
    <PageControlRow>
        <Checkbox
            checked={props.email}
            id={"email"}
            ariaLabel={"Email"}
            renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
            onChange={(isChecked) => {
                if (isChecked || props.sms[0]()) return;

                props.email[1](true);
            }}
        />

        <PageControlRowLabel>or</PageControlRowLabel>

        <Checkbox
            checked={props.sms}
            ariaLabel={"SMS"}
            renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
            onChange={(isChecked) => {
                if (isChecked || props.email[0]()) return;

                props.sms[1](true);
            }}
        />
    </PageControlRow>
);
