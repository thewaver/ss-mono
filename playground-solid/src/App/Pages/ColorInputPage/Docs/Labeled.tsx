import { createSignal } from "solid-js";

import { ColorInput, Label } from "@thewaver/ss-components-solid";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";

const LABEL_GAP = 5;

export const LabeledDocsExample = () => {
    const valueSignal = createSignal("#ff0055");

    return (
        <Label orientation={"vertical"} gap={LABEL_GAP}>
            <PageLabelCaption>Accent</PageLabelCaption>

            <ColorInput
                {...pageColorPickerSlots}
                value={valueSignal}
                {...COLOR_INPUT_LABELS}
                renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
            />
        </Label>
    );
};
