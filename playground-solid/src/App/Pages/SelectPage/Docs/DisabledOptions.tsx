import { createSignal } from "solid-js";

import { Select, access } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import {
    COUNTRIES_WITH_DISABLED,
    COUNTRIES_WITH_REACHABLE,
    PLACEHOLDER,
    renderSelectPopup,
} from "../SelectPageSolid.const";
import type { SelectDisabledOptionsDocsExampleProps } from "../SelectPageSolid.types";

type Props = SelectDisabledOptionsDocsExampleProps;

export const DisabledOptionsDocsExample = (props: Props) => {
    const valueSignal = createSignal<string | undefined>();

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueSignal}
            options={() => (access(props.isReachable) ? COUNTRIES_WITH_REACHABLE : COUNTRIES_WITH_DISABLED)}
            ariaLabel={"Country"}
            renderContent={(getSelectedOption, getFlags) => (
                <PageSelectContent flags={getFlags}>{getSelectedOption()?.value ?? PLACEHOLDER}</PageSelectContent>
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
