import { createSignal } from "solid-js";

import { Select, access } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import {
    PageSelectGroupBox,
    PageSelectGroupContent,
} from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { GROUPED_COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPageSolid.const";
import type { SelectGroupsDocsExampleProps } from "../SelectPageSolid.types";

type Props = SelectGroupsDocsExampleProps;

export const GroupsDocsExample = (props: Props) => {
    const valueSignal = createSignal<string | undefined>();

    return (
        <Select
            renderHighlightFloater={renderPageHighlightFloater}
            value={valueSignal}
            options={GROUPED_COUNTRIES}
            ariaLabel={"Country"}
            renderContent={(getSelectedOption, getFlags) => (
                <PageSelectContent flags={getFlags}>{getSelectedOption()?.value ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderGroupHeader={(getGroup) => <PageSelectGroupContent>{getGroup().label}</PageSelectGroupContent>}
            renderGroupBox={
                access(props.hasGroupBoxes)
                    ? (renderContent) => <PageSelectGroupBox>{renderContent()}</PageSelectGroupBox>
                    : undefined
            }
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent isGliding flags={getFlags}>
                    {getOption().value}
                </PageSelectOptionContent>
            )}
            renderPopup={renderSelectPopup}
        />
    );
};
