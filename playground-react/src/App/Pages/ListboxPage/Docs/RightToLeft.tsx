import { useState } from "react";

import { Listbox } from "@thewaver/ss-components-react";
import { SIZES } from "@thewaver/ss-playground/App/Pages/ListboxPage/ListboxPage.const";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import type { ListboxRightToLeftDocsExampleProps } from "../ListboxPageReact.types";

type Props = ListboxRightToLeftDocsExampleProps;

export const RightToLeftDocsExample = (props: Props) => {
    const size = useState<string | undefined>();

    return (
        <div dir={"rtl"}>
            <PageListboxSurface isWide={props.orientation === "horizontal"}>
                <Listbox
                    id={"size"}
                    renderHighlightFloater={renderPageHighlightFloater}
                    value={size}
                    options={SIZES}
                    orientation={props.orientation}
                    ariaLabel={"Size"}
                    renderOption={(option, flags) => (
                        <PageSelectOptionContent isGliding flags={flags}>
                            {option.value}
                        </PageSelectOptionContent>
                    )}
                />
            </PageListboxSurface>
        </div>
    );
};
