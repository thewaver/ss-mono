import { Checkbox, Label } from "@thewaver/ss-components";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { LabelExampleProps } from "../LabelPage.types";

type Props = LabelExampleProps;

export const SuppressedExample = (props: Props) => (
    <Label>
        <Checkbox
            checkedSignal={props.checkedSignal}
            ariaLabel={"Announced as something else"}
            renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
        />

        <PageLabelCaption>Subscribe to the newsletter</PageLabelCaption>
    </Label>
);
