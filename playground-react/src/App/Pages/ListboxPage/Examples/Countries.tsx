import { Listbox } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPage.const";
import type { ListboxExampleProps } from "../ListboxPage.types";

type Props = ListboxExampleProps;

export const CountriesExample = (props: Props) => (
    <PageListboxSurface>
        <Listbox
            renderHighlightFloater={renderPageHighlightFloater}
            value={props.value}
            options={COUNTRIES_WITH_REACHABLE}
            ariaLabel={"Shipping country"}
            renderOption={(option, flags) => (
                <PageSelectOptionContent isGliding flags={flags}>
                    {option.value}
                </PageSelectOptionContent>
            )}
        />
    </PageListboxSurface>
);
