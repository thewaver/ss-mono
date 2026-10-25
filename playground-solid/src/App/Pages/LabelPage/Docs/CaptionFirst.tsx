import { createSignal } from "solid-js";

import { Label, Toggle } from "@thewaver/ss-components-solid";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";

export const CaptionFirstDocsExample = () => {
    const checkedSignal = createSignal(true);

    return (
        <Label>
            <PageLabelCaption>Send notifications</PageLabelCaption>

            <Toggle checked={checkedSignal} renderContent={(getFlags) => <PageToggleContent flags={getFlags} />} />
        </Label>
    );
};
