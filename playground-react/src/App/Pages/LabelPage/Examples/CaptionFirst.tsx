import { Label, Toggle } from "@thewaver/ss-components-react";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import type { LabelExampleProps } from "../LabelPage.types";

type Props = LabelExampleProps;

export const CaptionFirstExample = (props: Props) => (
    <Label>
        <PageLabelCaption>Send notifications</PageLabelCaption>

        <Toggle checked={props.checked} renderContent={(flags) => <PageToggleContent flags={flags} />} />
    </Label>
);
