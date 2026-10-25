import { useState } from "react";

import { Checkbox, Label } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { LabelBasicDocsExampleProps } from "../LabelPageReact.types";

type Props = LabelBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const checkedState = useState(false);

    return (
        <Label orientation={props.orientation}>
            <Checkbox
                checked={checkedState}
                isDisabled={props.isDisabled}
                renderContent={(flags) => <PageCheckboxContent flags={flags} />}
            />

            <PageLabelCaption id={"rememberCaption"}>Remember me</PageLabelCaption>
        </Label>
    );
};
