import { useState } from "react";

import { Checkbox, Label } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";

export const SuppressedDocsExample = () => {
    const checkedState = useState(false);

    return (
        <Label>
            <Checkbox
                checked={checkedState}
                ariaLabel={"Announced as something else"}
                renderContent={(flags) => <PageCheckboxContent flags={flags} />}
            />

            <PageLabelCaption>Subscribe to the newsletter</PageLabelCaption>
        </Label>
    );
};
