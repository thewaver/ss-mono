import { createSignal } from "solid-js";

import { Select } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPageSolid.const";
import type { SelectBasicDocsExampleProps } from "../SelectPageSolid.types";

type Props = SelectBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueSignal = createSignal<string | undefined>();

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueSignal}
            options={COUNTRIES}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
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
