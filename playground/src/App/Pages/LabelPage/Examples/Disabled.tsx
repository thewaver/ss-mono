import { Checkbox, Label } from "@thewaver/ss-components";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { LabelExampleProps } from "../LabelPage.types";

type Props = LabelExampleProps;

export const DisabledExample = (props: Props) => (
    <Label>
        <Checkbox
            checkedSignal={props.checkedSignal}
            isDisabled={true}
            renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
        />

        <PageLabelCaption id={"disabledCaption"}>Caption clicks must do nothing</PageLabelCaption>
    </Label>
);
