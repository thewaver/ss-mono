import { Checkbox, Label } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { LabelExampleProps } from "../LabelPage.types";

const GAP = 5;

type Props = LabelExampleProps;

export const ColumnExample = (props: Props) => (
    <Label orientation={"vertical"} gap={GAP}>
        <PageLabelCaption>Stacked</PageLabelCaption>

        <Checkbox checkedState={props.checkedState} renderContent={(flags) => <PageCheckboxContent flags={flags} />} />
    </Label>
);
