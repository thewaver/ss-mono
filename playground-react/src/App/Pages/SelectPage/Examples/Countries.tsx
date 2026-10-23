import { Select } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import {
    PageSelectGroupBox,
    PageSelectGroupContent,
} from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import type { SelectExampleProps } from "../SelectPage.types";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPageReact.const";

type Props = SelectExampleProps & {
    isDisabled?: boolean;
    hasError?: boolean;
    hasGroups?: boolean;
    hasGroupBoxes?: boolean;
};

export const CountriesExample = (props: Props) => {
    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={props.value}
            options={props.options ?? COUNTRIES}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={"Country"}
            renderContent={(selectedOption, flags) => (
                <PageSelectContent flags={flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderGroupHeader={
                props.hasGroups ? (group) => <PageSelectGroupContent>{group.label}</PageSelectGroupContent> : undefined
            }
            renderGroupBox={
                props.hasGroupBoxes
                    ? (renderContent) => <PageSelectGroupBox>{renderContent()}</PageSelectGroupBox>
                    : undefined
            }
            renderOption={(option, flags) => (
                <PageSelectOptionContent isGliding flags={flags}>
                    {option.value}
                </PageSelectOptionContent>
            )}
            renderPopup={renderSelectPopup}
        />
    );
};
