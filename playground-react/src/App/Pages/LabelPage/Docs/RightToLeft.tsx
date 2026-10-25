import { useState } from "react";

import { Checkbox, Label } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";

export const RightToLeftDocsExample = () => {
    const checkedState = useState(false);

    return (
        <div dir={"rtl"}>
            <Label>
                <Checkbox checked={checkedState} renderContent={(flags) => <PageCheckboxContent flags={flags} />} />

                <PageLabelCaption>Remember me</PageLabelCaption>
            </Label>
        </div>
    );
};
