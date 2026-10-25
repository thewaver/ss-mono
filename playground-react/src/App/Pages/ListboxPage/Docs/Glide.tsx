import { useState } from "react";

import { Listbox } from "@thewaver/ss-components-react";

import {
    renderPageHighlightFloater,
    renderPageSelectionFloater,
} from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPageReact.const";
import type { ListboxGlideDocsExampleProps } from "../ListboxPageReact.types";

type Props = ListboxGlideDocsExampleProps;

export const GlideDocsExample = (props: Props) => {
    const country = useState<string | undefined>("Portugal");

    return (
        <PageListboxSurface>
            <Listbox
                id={"glidingCountry"}
                renderSelectionFloater={props.isGliding ? renderPageSelectionFloater : undefined}
                renderHighlightFloater={props.isGliding ? renderPageHighlightFloater : undefined}
                value={country}
                options={COUNTRIES_WITH_REACHABLE}
                ariaLabel={"Shipping country, gliding"}
                renderOption={(option, flags) => (
                    <PageSelectOptionContent isGliding={props.isGliding} flags={flags}>
                        {option.value}
                    </PageSelectOptionContent>
                )}
            />
        </PageListboxSurface>
    );
};
