import { useState } from "react";

import { MultiSelect } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectClear } from "../../../StyledComponents/SelectClear/SelectClear";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../../SelectPage/SelectPageReact.const";

export const ClearableDocsExample = () => {
    const valuesState = useState<string[]>(["Belgium", "Sweden"]);
    const [lastChange, setLastChange] = useState("none yet");

    return (
        <>
            <MultiSelect
                renderHighlightFloater={renderPageHighlightFloater}
                values={valuesState}
                options={COUNTRIES}
                ariaLabel={"Countries"}
                clearAriaLabel={"Clear countries"}
                padding={QUERY_PADDING}
                renderContent={(selectedOptions, flags) => (
                    <PageSelectContent flags={flags} hasClearSpace={true}>
                        {selectedOptions.length
                            ? selectedOptions.map((option) => option.value).join(", ")
                            : PLACEHOLDER}
                    </PageSelectContent>
                )}
                renderOption={(option, flags) => (
                    <PageSelectOptionContent isGliding flags={flags}>
                        {option.value}
                    </PageSelectOptionContent>
                )}
                renderClear={(flags) => <PageSelectClear flags={flags} />}
                renderPopup={renderSelectPopup}
                onSelectionChange={(values) => setLastChange(values.length ? values.join(", ") : "cleared")}
            />

            <div className={exampleStyles.exampleReadout} data-readout>{`Last change: ${lastChange}`}</div>
        </>
    );
};
