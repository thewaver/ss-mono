import { createSignal } from "solid-js";

import { Listbox, access } from "@thewaver/ss-components-solid";
import { SHIPPING_COUNTRY_GLIDING_LABEL } from "@thewaver/ss-playground/App/Pages/ListboxPage/ListboxPage.const";

import {
    renderPageHighlightFloater,
    renderPageSelectionFloater,
} from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPageSolid.const";
import type { ListboxGlideDocsExampleProps } from "../ListboxPageSolid.types";

type Props = ListboxGlideDocsExampleProps;

export const GlideDocsExample = (props: Props) => {
    const country = createSignal<string | undefined>("Portugal");

    return (
        <PageListboxSurface>
            <Listbox
                id={"glidingCountry"}
                renderSelectionFloater={access(props.isGliding) ? renderPageSelectionFloater : undefined}
                renderHighlightFloater={access(props.isGliding) ? renderPageHighlightFloater : undefined}
                value={country}
                options={COUNTRIES_WITH_REACHABLE}
                ariaLabel={SHIPPING_COUNTRY_GLIDING_LABEL}
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent
                        hasHoverFloater={props.isGliding}
                        hasSelectionFloater={props.isGliding}
                        flags={getFlags}
                    >
                        {getOption().value}
                    </PageSelectOptionContent>
                )}
            />
        </PageListboxSurface>
    );
};
