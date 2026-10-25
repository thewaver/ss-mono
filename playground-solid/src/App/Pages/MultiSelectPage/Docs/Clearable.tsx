import { createSignal } from "solid-js";

import { MultiSelect } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectClear } from "../../../StyledComponents/SelectClear/SelectClear";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../../SelectPage/SelectPageSolid.const";

export const ClearableDocsExample = () => {
    const valuesSignal = createSignal<string[]>(["Belgium", "Sweden"]);
    const [getLastChange, setLastChange] = createSignal("none yet");

    return (
        <>
            <MultiSelect
                renderHighlightFloater={renderPageHighlightFloater}
                values={valuesSignal}
                options={COUNTRIES}
                ariaLabel={"Countries"}
                clearAriaLabel={"Clear countries"}
                padding={QUERY_PADDING}
                renderContent={(getSelectedOptions, getFlags) => (
                    <PageSelectContent flags={getFlags} hasClearSpace={true}>
                        {getSelectedOptions().length
                            ? getSelectedOptions()
                                  .map((option) => option.value)
                                  .join(", ")
                            : PLACEHOLDER}
                    </PageSelectContent>
                )}
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent isGliding flags={getFlags}>
                        {getOption().value}
                    </PageSelectOptionContent>
                )}
                renderClear={(getFlags) => <PageSelectClear flags={getFlags} />}
                renderPopup={renderSelectPopup}
                onSelectionChange={(values) => setLastChange(values.length ? values.join(", ") : "cleared")}
            />

            <div class={exampleStyles.exampleReadout}>{`Last change: ${getLastChange()}`}</div>
        </>
    );
};
