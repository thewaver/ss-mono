import { useState } from "react";

import { Listbox } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPageReact.const";
import type { ListboxBasicDocsExampleProps } from "../ListboxPageReact.types";

type Props = ListboxBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const country = useState<string | undefined>("Portugal");

    return (
        <PageListboxSurface>
            <Listbox
                id={"shippingCountry"}
                renderHighlightFloater={renderPageHighlightFloater}
                value={country}
                options={COUNTRIES_WITH_REACHABLE}
                isDisabled={props.isDisabled}
                ariaLabel={"Shipping country"}
                renderOption={(option, flags) => (
                    <PageSelectOptionContent isGliding flags={flags}>
                        {option.value}
                    </PageSelectOptionContent>
                )}
            />
        </PageListboxSurface>
    );
};
