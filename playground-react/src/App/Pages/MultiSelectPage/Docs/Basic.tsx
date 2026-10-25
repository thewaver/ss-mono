import { useState } from "react";

import { MultiSelect } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../../SelectPage/SelectPageReact.const";
import type { MultiSelectBasicDocsExampleProps } from "../MultiSelectPageReact.types";

type Props = MultiSelectBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valuesState = useState<string[]>(["Denmark"]);

    return (
        <MultiSelect
            renderHighlightFloater={renderPageHighlightFloater}
            values={valuesState}
            options={COUNTRIES}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Countries"}
            renderContent={(selectedOptions, flags) => (
                <PageSelectContent flags={flags}>
                    {selectedOptions.length ? selectedOptions.map((option) => option.value).join(", ") : PLACEHOLDER}
                </PageSelectContent>
            )}
            renderOption={(option, flags) => (
                <PageSelectOptionContent isGliding flags={flags}>
                    {option.value}
                </PageSelectOptionContent>
            )}
            renderPopup={renderSelectPopup}
        />
    );
};
