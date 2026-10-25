import { useState } from "react";

import { ColorInput, Label } from "@thewaver/ss-components-react";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";

const LABEL_GAP = 5;

export const LabeledDocsExample = () => {
    const valueState = useState("#ff0055");

    return (
        <Label orientation={"vertical"} gap={LABEL_GAP}>
            <PageLabelCaption>Accent</PageLabelCaption>

            <ColorInput
                {...pageColorPickerSlots}
                value={valueState}
                {...COLOR_INPUT_LABELS}
                renderContent={(renderProps) => <PageColorInputContent renderProps={renderProps} />}
            />
        </Label>
    );
};
