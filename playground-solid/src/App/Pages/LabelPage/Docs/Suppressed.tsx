import { createSignal } from "solid-js";

import { Checkbox, Label } from "@thewaver/ss-components-solid";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";

export const SuppressedDocsExample = () => {
    const checkedSignal = createSignal(false);

    return (
        <Label>
            <Checkbox
                checked={checkedSignal}
                ariaLabel={"Announced as something else"}
                renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
            />

            <PageLabelCaption>Subscribe to the newsletter</PageLabelCaption>
        </Label>
    );
};
