import { Checkbox, Label } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { LabelExampleProps } from "../LabelPage.types";

type Props = LabelExampleProps;

export const DisabledExample = (props: Props) => (
    <Label>
        <Checkbox
            checkedState={props.checkedState}
            isDisabled={true}
            renderContent={(flags) => <PageCheckboxContent flags={flags} />}
        />

        <PageLabelCaption id={"disabledCaption"}>Caption clicks must do nothing</PageLabelCaption>
    </Label>
);
