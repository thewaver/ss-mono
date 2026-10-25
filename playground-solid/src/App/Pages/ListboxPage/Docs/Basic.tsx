import { createSignal } from "solid-js";

import { Listbox } from "@thewaver/ss-components-solid";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPageSolid.const";
import type { ListboxBasicDocsExampleProps } from "../ListboxPageSolid.types";

type Props = ListboxBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const country = createSignal<string | undefined>("Portugal");

    return (
        <PageListboxSurface>
            <Listbox
                id={"shippingCountry"}
                renderHighlightFloater={renderPageHighlightFloater}
                value={country}
                options={COUNTRIES_WITH_REACHABLE}
                isDisabled={props.isDisabled}
                ariaLabel={"Shipping country"}
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent isGliding flags={getFlags}>
                        {getOption().value}
                    </PageSelectOptionContent>
                )}
            />
        </PageListboxSurface>
    );
};
