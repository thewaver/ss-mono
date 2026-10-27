import { createSignal } from "solid-js";

import { Select } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import type { Airport } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { AIRPORTS, PLACEHOLDER, renderSelectPopup } from "../SelectPageSolid.const";

export const RecordsDocsExample = () => {
    const valueSignal = createSignal<Airport | undefined>(undefined);

    return (
        <>
            <Select
                renderHighlightFloater={renderPageHighlightFloater}
                name={"airport"}
                computeFormValue={(airport) => airport.code}
                value={valueSignal}
                options={AIRPORTS}
                ariaLabel={"Airport"}
                renderContent={(getSelectedOption, getFlags) => (
                    <PageSelectContent flags={getFlags}>
                        {getSelectedOption() ? getSelectedOption()!.value.city : PLACEHOLDER}
                    </PageSelectContent>
                )}
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent isGliding flags={getFlags}>
                        {getOption().value.city} ({getOption().value.code})
                    </PageSelectOptionContent>
                )}
                renderPopup={renderSelectPopup}
            />

            <div
                class={exampleStyles.exampleReadout}
                data-readout
            >{`Value: ${JSON.stringify(valueSignal[0]()) ?? "none"}`}</div>
        </>
    );
};
