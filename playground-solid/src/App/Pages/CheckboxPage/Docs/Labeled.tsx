import { createSignal } from "solid-js";

import { Checkbox, Label } from "@thewaver/ss-components-solid";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";

const LABEL_GAP = 10;

export const LabeledDocsExample = () => {
    const checkedSignal = createSignal(false);

    return (
        <Label orientation={"horizontal"} gap={LABEL_GAP}>
            <Checkbox checked={checkedSignal} renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />} />

            <PageLabelCaption>Send me the newsletter</PageLabelCaption>
        </Label>
    );
};
