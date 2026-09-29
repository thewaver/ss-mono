import { Checkbox, Label } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { LabelExampleProps } from "../LabelPage.types";

type Props = LabelExampleProps;

export const SuppressedExample = (props: Props) => (
    <Label>
        <Checkbox
            checked={props.checked}
            ariaLabel={"Announced as something else"}
            renderContent={(flags) => <PageCheckboxContent flags={flags} />}
        />

        <PageLabelCaption>Subscribe to the newsletter</PageLabelCaption>
    </Label>
);
