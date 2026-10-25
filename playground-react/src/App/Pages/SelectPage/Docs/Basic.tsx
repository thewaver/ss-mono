import { useState } from "react";

import { Select } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPageReact.const";
import type { SelectBasicDocsExampleProps } from "../SelectPageReact.types";

type Props = SelectBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState<string | undefined>();

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueState}
            options={COUNTRIES}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Country"}
            renderContent={(selectedOption, flags) => (
                <PageSelectContent flags={flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
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
