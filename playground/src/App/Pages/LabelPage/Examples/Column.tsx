import { Checkbox, Label } from "@thewaver/ss-components";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { LabelExampleProps } from "../LabelPage.types";

const GAP = 5;

type Props = LabelExampleProps;

export const ColumnExample = (props: Props) => (
    <Label dir={"column"} gap={() => GAP}>
        <PageLabelCaption>Stacked</PageLabelCaption>

        <Checkbox
            checkedSignal={props.checkedSignal}
            renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
        />
    </Label>
);
