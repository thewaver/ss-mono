import { createSignal } from "solid-js";

import { Listbox, access } from "@thewaver/ss-components-solid";

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
                ariaLabel={"Shipping country, gliding"}
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent isGliding={props.isGliding} flags={getFlags}>
                        {getOption().value}
                    </PageSelectOptionContent>
                )}
            />
        </PageListboxSurface>
    );
};
