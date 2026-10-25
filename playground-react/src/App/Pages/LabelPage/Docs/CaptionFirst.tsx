import { useState } from "react";

import { Label, Toggle } from "@thewaver/ss-components-react";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";

export const CaptionFirstDocsExample = () => {
    const checkedState = useState(true);

    return (
        <Label>
            <PageLabelCaption>Send notifications</PageLabelCaption>

            <Toggle checked={checkedState} renderContent={(flags) => <PageToggleContent flags={flags} />} />
        </Label>
    );
};
