import { ColorInput, Label } from "@thewaver/ss-components";

import { pageColorPickerSlots } from "../../../StyledComponents/ColorAreaContent/ColorAreaContent";
import { PageColorInputContent } from "../../../StyledComponents/ColorInputContent/ColorInputContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { ColorInputExampleProps } from "../ColorInputPage.types";

const LABEL_GAP = 5;

type Props = ColorInputExampleProps;

export const LabelledExample = (props: Props) => (
    <Label dir={"column"} gap={() => LABEL_GAP}>
        <PageLabelCaption>Accent</PageLabelCaption>

        <ColorInput
            {...pageColorPickerSlots}
            valueSignal={props.valueSignal}
            renderContent={(getRenderProps) => <PageColorInputContent renderProps={getRenderProps} />}
        />
    </Label>
);
