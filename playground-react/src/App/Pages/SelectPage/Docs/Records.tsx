import { useState } from "react";

import { Select } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import type { Airport } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { AIRPORTS, PLACEHOLDER, renderSelectPopup } from "../SelectPageReact.const";

export const RecordsDocsExample = () => {
    const valueState = useState<Airport | undefined>(undefined);

    return (
        <>
            <Select
                renderHighlightFloater={renderPageHighlightFloater}
                name={"airport"}
                computeFormValue={(airport) => airport.code}
                value={valueState}
                options={AIRPORTS}
                ariaLabel={"Airport"}
                renderContent={(selectedOption, flags) => (
                    <PageSelectContent flags={flags}>
                        {selectedOption ? selectedOption.value.city : PLACEHOLDER}
                    </PageSelectContent>
                )}
                renderOption={(option, flags) => (
                    <PageSelectOptionContent isGliding flags={flags}>
                        {option.value.city} ({option.value.code})
                    </PageSelectOptionContent>
                )}
                renderPopup={renderSelectPopup}
            />

            <div
                className={exampleStyles.exampleReadout}
                data-readout
            >{`Value: ${JSON.stringify(valueState[0]) ?? "none"}`}</div>
        </>
    );
};
