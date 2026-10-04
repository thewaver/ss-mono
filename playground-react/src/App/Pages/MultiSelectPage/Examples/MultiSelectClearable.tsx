import { MultiSelect } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectClear } from "../../../StyledComponents/SelectClear/SelectClear";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../../SelectPage/SelectPage.const";
import type { MultiSelectClearableExampleProps } from "../MultiSelectPage.types";

type Props = MultiSelectClearableExampleProps;

export const MultiSelectClearableExample = (props: Props) => (
    <MultiSelect
        renderHighlightFloater={renderPageHighlightFloater}
        values={props.values}
        options={COUNTRIES}
        ariaLabel={"Countries"}
        clearAriaLabel={"Clear countries"}
        padding={QUERY_PADDING}
        renderContent={(selectedOptions, flags) => (
            <PageSelectContent flags={flags} hasClearSpace={true}>
                {selectedOptions.length ? selectedOptions.map((option) => option.value).join(", ") : PLACEHOLDER}
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
