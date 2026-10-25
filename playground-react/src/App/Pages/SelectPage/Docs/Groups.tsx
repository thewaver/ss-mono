import { useState } from "react";

import { Select } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import {
    PageSelectGroupBox,
    PageSelectGroupContent,
} from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { GROUPED_COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPageReact.const";
import type { SelectGroupsDocsExampleProps } from "../SelectPageReact.types";

type Props = SelectGroupsDocsExampleProps;

export const GroupsDocsExample = (props: Props) => {
    const valueState = useState<string | undefined>();

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueState}
            options={GROUPED_COUNTRIES}
            ariaLabel={"Country"}
            renderContent={(selectedOption, flags) => (
                <PageSelectContent flags={flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderGroupHeader={(group) => <PageSelectGroupContent>{group.label}</PageSelectGroupContent>}
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
