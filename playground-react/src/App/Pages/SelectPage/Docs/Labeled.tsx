import { useState } from "react";

import { Label, Select } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPageReact.const";

const LABEL_GAP = 5;

export const LabeledDocsExample = () => {
    const valueState = useState<string | undefined>(undefined);

    return (
        <Label orientation={"vertical"} gap={LABEL_GAP}>
            <PageLabelCaption>Country</PageLabelCaption>

            <Select
                renderHighlightFloater={renderPageHighlightFloater}
                value={valueState}
                options={COUNTRIES}
                listAriaLabel={"Country"}
                renderContent={(selectedOption, flags) => (
                    <PageSelectContent flags={flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
                )}
                renderOption={(option, flags) => (
                    <PageSelectOptionContent isGliding flags={flags}>
                        {option.value}
                    </PageSelectOptionContent>
                )}
                renderPopup={renderSelectPopup}
            />
        </Label>
    );
};
