import { createSignal } from "solid-js";

import { Select } from "@thewaver/ss-components-solid";
import type { Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { DELIVERIES, PLACEHOLDER, renderSelectPopup } from "../SelectPageSolid.const";

export const DescribedDocsExample = () => {
    const valueSignal = createSignal<Delivery | undefined>(undefined);

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueSignal}
            options={DELIVERIES}
            ariaLabel={"Delivery"}
            renderContent={(getSelectedOption, getFlags) => (
                <PageSelectContent flags={getFlags}>{getSelectedOption()?.value.name ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent isGliding flags={getFlags} description={() => getOption().value.description}>
                    {getOption().value.name}
                </PageSelectOptionContent>
            )}
            renderPopup={renderSelectPopup}
        />
    );
};
