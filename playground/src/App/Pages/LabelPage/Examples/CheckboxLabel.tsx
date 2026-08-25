import { Checkbox, Label } from "@thewaver/ss-components";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { LabelExampleProps } from "../LabelPage.types";

type Props = LabelExampleProps;

export const CheckboxLabelExample = (props: Props) => (
    <Label>
        <Checkbox
            checkedSignal={props.checkedSignal}
            renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
        />

        <PageLabelCaption id={"rememberCaption"}>Remember me</PageLabelCaption>
    </Label>
);
