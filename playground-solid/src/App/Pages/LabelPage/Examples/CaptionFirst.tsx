import { Label, Toggle } from "@thewaver/ss-components-solid";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import type { LabelExampleProps } from "../LabelPage.types";

type Props = LabelExampleProps;

export const CaptionFirstExample = (props: Props) => (
    <Label>
        <PageLabelCaption>Send notifications</PageLabelCaption>

        <Toggle
            checked={props.checked}
            renderContent={(getFlags) => <PageToggleContent flags={getFlags} />}
        />
    </Label>
);
