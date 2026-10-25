import { createSignal } from "solid-js";

import { Label, Toggle } from "@thewaver/ss-components-solid";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";

const LABEL_GAP = 10;

export const LabeledDocsExample = () => {
    const checkedSignal = createSignal(false);

    return (
        <Label orientation={"horizontal"} gap={LABEL_GAP}>
            <Toggle checked={checkedSignal} renderContent={(getFlags) => <PageToggleContent flags={getFlags} />} />

            <PageLabelCaption>Dark mode</PageLabelCaption>
        </Label>
    );
};
