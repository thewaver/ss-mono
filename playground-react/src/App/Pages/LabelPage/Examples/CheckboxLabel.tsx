import { Checkbox, Label } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { LabelExampleProps } from "../LabelPage.types";

type Props = LabelExampleProps;

export const CheckboxLabelExample = (props: Props) => (
    <Label>
        <Checkbox checkedState={props.checkedState} renderContent={(flags) => <PageCheckboxContent flags={flags} />} />

        <PageLabelCaption id={"rememberCaption"}>Remember me</PageLabelCaption>
    </Label>
);
