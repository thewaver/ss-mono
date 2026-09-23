import { ColorInput, Label } from "@thewaver/ss-components";

import { COLOR_INPUT_LABELS } from "../../../PageComponents/Announcements/Announcements.const";
import { pageColorPickerSlots } from "../../../StyledComponents/ColorAreaContent/ColorAreaContent";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

const LABEL_GAP = 5;

type Props = ColorInputExampleProps;

export const LabelledExample = (props: Props) => (
    <Label orientation={"vertical"} gap={() => LABEL_GAP}>
        <PageLabelCaption>Accent</PageLabelCaption>

        <ColorInput
            {...pageColorPickerSlots}
            valueSignal={props.valueSignal}
            {...COLOR_INPUT_LABELS}
            renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
        />
    </Label>
);
