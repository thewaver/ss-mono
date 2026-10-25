import { useState } from "react";

import { Select } from "@thewaver/ss-components-react";
import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { DELIVERIES, PLACEHOLDER, renderSelectPopup } from "../SelectPageReact.const";

export const DescribedDocsExample = () => {
    const valueState = useState<Delivery | undefined>(undefined);

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueState}
            options={DELIVERIES}
            ariaLabel={"Delivery"}
            renderContent={(selectedOption, flags) => (
                <PageSelectContent flags={flags}>{selectedOption?.value.name ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(option, flags) => (
                <PageSelectOptionContent isGliding flags={flags} description={option.value.description}>
                    {option.value.name}
                </PageSelectOptionContent>
            )}
            renderPopup={renderSelectPopup}
        />
    );
};
