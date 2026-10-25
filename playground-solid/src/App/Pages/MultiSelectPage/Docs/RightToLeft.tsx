import { createSignal } from "solid-js";

import { MultiSelect } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectClear } from "../../../StyledComponents/SelectClear/SelectClear";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../../SelectPage/SelectPageSolid.const";

export const RightToLeftDocsExample = () => {
    const valuesSignal = createSignal<string[]>(["Belgium", "Sweden"]);

    return (
        <div dir={"rtl"}>
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
            />
        </div>
    );
};
