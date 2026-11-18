import { useState } from "react";

import { Checkbox, Label } from "@thewaver/ss-components-react";
import { ANNOUNCED_SOMETHING_ELSE_LABEL } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.const";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";

export const SuppressedDocsExample = () => {
    const checkedState = useState(false);

    return (
        <Label>
            <Checkbox
                checked={checkedState}
                ariaLabel={ANNOUNCED_SOMETHING_ELSE_LABEL}
                renderContent={(flags) => <PageCheckboxContent flags={flags} />}
            />

            <PageLabelCaption>Subscribe to the newsletter</PageLabelCaption>
        </Label>
    );
};
