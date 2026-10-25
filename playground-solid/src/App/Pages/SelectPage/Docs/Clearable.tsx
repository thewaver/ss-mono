import { createSignal } from "solid-js";

import { Select } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectClear } from "../../../StyledComponents/SelectClear/SelectClear";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../SelectPageSolid.const";

export const ClearableDocsExample = () => {
    const valueSignal = createSignal<string | undefined>("Estonia");
    const [getLastChange, setLastChange] = createSignal("none yet");

    return (
        <>
            <Select
                renderHighlightFloater={renderPageHighlightFloater}
                value={valueSignal}
                options={COUNTRIES}
                ariaLabel={"Country"}
                clearAriaLabel={"Clear country"}
                padding={QUERY_PADDING}
                renderContent={(getSelectedOption, getFlags) => (
                    <PageSelectContent flags={getFlags} hasClearSpace={true}>
                        {getSelectedOption()?.value ?? PLACEHOLDER}
                    </PageSelectContent>
                )}
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent isGliding flags={getFlags}>
                        {getOption().value}
                    </PageSelectOptionContent>
                )}
                renderClear={(getFlags) => <PageSelectClear flags={getFlags} />}
                renderPopup={renderSelectPopup}
                onSelectionChange={(value) => setLastChange(value ?? "cleared")}
            />

            <div class={exampleStyles.exampleReadout} data-readout>{`Last change: ${getLastChange()}`}</div>
        </>
    );
};
