import { useState } from "react";

import { Select } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import {
    COUNTRIES_WITH_DISABLED,
    COUNTRIES_WITH_REACHABLE,
    PLACEHOLDER,
    renderSelectPopup,
} from "../SelectPageReact.const";
import type { SelectDisabledOptionsDocsExampleProps } from "../SelectPageReact.types";

type Props = SelectDisabledOptionsDocsExampleProps;

export const DisabledOptionsDocsExample = (props: Props) => {
    const valueState = useState<string | undefined>();

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueState}
            options={props.isReachable ? COUNTRIES_WITH_REACHABLE : COUNTRIES_WITH_DISABLED}
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
