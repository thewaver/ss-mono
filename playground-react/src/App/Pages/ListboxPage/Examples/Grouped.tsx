import { MultiListbox } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { GROUPED_COUNTRIES } from "../../SelectPage/SelectPage.const";
import type { MultiListboxExampleProps } from "../ListboxPage.types";

type Props = MultiListboxExampleProps;

export const GroupedExample = (props: Props) => (
    <PageListboxSurface>
        <MultiListbox
            renderHighlightFloater={renderPageHighlightFloater}
            values={props.values}
            options={GROUPED_COUNTRIES}
            ariaLabel={"Countries to ship to"}
            renderGroup={(group, flags) => <PageSelectGroupContent flags={flags}>{group.label}</PageSelectGroupContent>}
            renderOption={(option, flags) => (
                <PageSelectOptionContent isGliding flags={flags}>
                    {option.value}
                </PageSelectOptionContent>
            )}
        />
    </PageListboxSurface>
);
