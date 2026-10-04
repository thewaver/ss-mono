import { Select } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectClear } from "../../../StyledComponents/SelectClear/SelectClear";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../SelectPage.const";
import type { SelectClearableExampleProps } from "../SelectPage.types";

type Props = SelectClearableExampleProps;

export const ClearableExample = (props: Props) => {
    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={props.value}
            options={COUNTRIES}
            ariaLabel={"Country"}
            clearAriaLabel={"Clear country"}
            padding={QUERY_PADDING}
            renderContent={(selectedOption, flags) => (
                <PageSelectContent flags={flags} hasClearSpace={true}>
                    {selectedOption?.value ?? PLACEHOLDER}
                </PageSelectContent>
            )}
            renderOption={(option, flags) => (
                <PageSelectOptionContent isGliding flags={flags}>
                    {option.value}
                </PageSelectOptionContent>
            )}
            renderClear={(flags) => <PageSelectClear flags={flags} />}
            renderPopup={renderSelectPopup}
            onSelectionChange={props.onSelectionChange}
        />
    );
};
