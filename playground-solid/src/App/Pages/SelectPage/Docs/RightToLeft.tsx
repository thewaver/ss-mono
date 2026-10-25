import { createSignal } from "solid-js";

import { Select } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectClear } from "../../../StyledComponents/SelectClear/SelectClear";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../SelectPageSolid.const";

export const RightToLeftDocsExample = () => {
    const valueSignal = createSignal<string | undefined>("Estonia");

    return (
        <div dir={"rtl"}>
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
            />
        </div>
    );
};
