import { useState } from "react";

import { MultiListbox } from "@thewaver/ss-components-react";
import { COUNTRIES_SHIP_LABEL } from "@thewaver/ss-playground/App/Pages/ListboxPage/ListboxPage.const";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { GROUPED_COUNTRIES } from "../../SelectPage/SelectPageReact.const";

export const GroupsDocsExample = () => {
    const countries = useState<string[]>(["Denmark"]);

    return (
        <PageListboxSurface>
            <MultiListbox
                id={"shippingCountries"}
                renderHighlightFloater={renderPageHighlightFloater}
                values={countries}
                options={GROUPED_COUNTRIES}
                ariaLabel={COUNTRIES_SHIP_LABEL}
                renderGroupHeader={(group, flags) => (
                    <PageSelectGroupContent flags={flags}>{group.label}</PageSelectGroupContent>
                )}
                renderOption={(option, flags) => (
                    <PageSelectOptionContent hasHoverFloater flags={flags}>
                        {option.value}
                    </PageSelectOptionContent>
                )}
            />
        </PageListboxSurface>
    );
};
