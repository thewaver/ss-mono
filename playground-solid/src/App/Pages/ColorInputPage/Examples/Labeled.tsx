import { ColorInput, Label } from "@thewaver/ss-components-solid";
import { COLOR_INPUT_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import { pageColorPickerSlots } from "../../../PageComponents/ColorPicker/ColorPicker";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

const LABEL_GAP = 5;

type Props = ColorInputExampleProps;

export const LabeledExample = (props: Props) => (
    <Label orientation={"vertical"} gap={() => LABEL_GAP}>
        <PageLabelCaption>Accent</PageLabelCaption>

        <ColorInput
            {...pageColorPickerSlots}
            value={props.value}
            {...COLOR_INPUT_LABELS}
            renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
        />
    </Label>
);
