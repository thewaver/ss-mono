import { createSignal } from "solid-js";

import { MultiSelect } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../../SelectPage/SelectPageSolid.const";
import type { MultiSelectBasicDocsExampleProps } from "../MultiSelectPageSolid.types";

type Props = MultiSelectBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valuesSignal = createSignal<string[]>(["Denmark"]);

    return (
        <MultiSelect
            renderHighlightFloater={renderPageHighlightFloater}
            values={valuesSignal}
            options={COUNTRIES}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Countries"}
            renderContent={(getSelectedOptions, getFlags) => (
                <PageSelectContent flags={getFlags}>
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
            renderPopup={renderSelectPopup}
        />
    );
};
