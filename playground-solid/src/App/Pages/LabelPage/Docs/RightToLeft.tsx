import { createSignal } from "solid-js";

import { Checkbox, Label } from "@thewaver/ss-components-solid";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";

export const RightToLeftDocsExample = () => {
    const checkedSignal = createSignal(false);

    return (
        <div dir={"rtl"}>
            <Label>
                <Checkbox
                    checked={checkedSignal}
                    renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
                />

                <PageLabelCaption>Remember me</PageLabelCaption>
            </Label>
        </div>
    );
};
