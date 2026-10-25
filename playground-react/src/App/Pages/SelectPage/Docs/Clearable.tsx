import { useState } from "react";

import { Select } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectClear } from "../../../StyledComponents/SelectClear/SelectClear";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../SelectPageReact.const";

export const ClearableDocsExample = () => {
    const valueState = useState<string | undefined>("Estonia");
    const [lastChange, setLastChange] = useState("none yet");

    return (
        <>
            <Select
                renderHighlightFloater={renderPageHighlightFloater}
                value={valueState}
                options={COUNTRIES}
                ariaLabel={"Country"}
                clearAriaLabel={"Clear country"}
                padding={QUERY_PADDING}
                renderContent={(selectedOption, flags) => (
                    <PageSelectContent flags={flags} hasClearSpace={true}>
                        {selectedOption?.value ?? PLACEHOLDER}
                    </PageSelectContent>
                )}
                renderOption={(option, flags) => (
                    <PageSelectOptionContent isGliding flags={flags}>
                        {option.value}
                    </PageSelectOptionContent>
                )}
                renderClear={(flags) => <PageSelectClear flags={flags} />}
                renderPopup={renderSelectPopup}
                onSelectionChange={(value) => setLastChange(value ?? "cleared")}
            />

            <div className={exampleStyles.exampleReadout} data-readout>{`Last change: ${lastChange}`}</div>
        </>
    );
};
