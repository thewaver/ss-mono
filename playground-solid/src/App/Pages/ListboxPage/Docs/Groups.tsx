import { createSignal } from "solid-js";

import { MultiListbox } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { GROUPED_COUNTRIES } from "../../SelectPage/SelectPageSolid.const";

export const GroupsDocsExample = () => {
    const countries = createSignal<string[]>(["Denmark"]);

    return (
        <PageListboxSurface>
            <MultiListbox
                id={"shippingCountries"}
                renderHighlightFloater={renderPageHighlightFloater}
                values={countries}
                options={GROUPED_COUNTRIES}
                ariaLabel={"Countries to ship to"}
                renderGroupHeader={(getGroup, getFlags) => (
                    <PageSelectGroupContent flags={getFlags}>{getGroup().label}</PageSelectGroupContent>
                )}
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent isGliding flags={getFlags}>
                        {getOption().value}
                    </PageSelectOptionContent>
                )}
            />
        </PageListboxSurface>
    );
};
