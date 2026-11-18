import { createSignal } from "solid-js";

import { Checkbox, Label } from "@thewaver/ss-components-solid";
import { ANNOUNCED_SOMETHING_ELSE_LABEL } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.const";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";

export const SuppressedDocsExample = () => {
    const checkedSignal = createSignal(false);

    return (
        <Label>
            <Checkbox
                checked={checkedSignal}
                ariaLabel={ANNOUNCED_SOMETHING_ELSE_LABEL}
                renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
            />

            <PageLabelCaption>Subscribe to the newsletter</PageLabelCaption>
        </Label>
    );
};
