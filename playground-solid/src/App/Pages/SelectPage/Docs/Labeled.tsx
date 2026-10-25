import { createSignal } from "solid-js";

import { Label, Select } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPageSolid.const";

const LABEL_GAP = 5;

export const LabeledDocsExample = () => {
    const valueSignal = createSignal<string | undefined>(undefined);

    return (
        <Label orientation={"vertical"} gap={LABEL_GAP}>
            <PageLabelCaption>Country</PageLabelCaption>

            <Select
                renderHighlightFloater={renderPageHighlightFloater}
                value={valueSignal}
                options={COUNTRIES}
                listAriaLabel={"Country"}
                renderContent={(getSelectedOption, getFlags) => (
                    <PageSelectContent flags={getFlags}>{getSelectedOption()?.value ?? PLACEHOLDER}</PageSelectContent>
                )}
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent isGliding flags={getFlags}>
                        {getOption().value}
                    </PageSelectOptionContent>
                )}
                renderPopup={renderSelectPopup}
            />
        </Label>
    );
};
