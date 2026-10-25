import { createSignal } from "solid-js";

import { Listbox, access } from "@thewaver/ss-components-solid";
import { SIZES } from "@thewaver/ss-playground/App/Pages/ListboxPage/ListboxPage.const";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import type { ListboxRightToLeftDocsExampleProps } from "../ListboxPageSolid.types";

type Props = ListboxRightToLeftDocsExampleProps;

export const RightToLeftDocsExample = (props: Props) => {
    const size = createSignal<string | undefined>();

    return (
        <div dir={"rtl"}>
            <PageListboxSurface isWide={() => access(props.orientation) === "horizontal"}>
                <Listbox
                    id={"size"}
                    renderHighlightFloater={renderPageHighlightFloater}
                    value={size}
                    options={SIZES}
                    orientation={props.orientation}
                    ariaLabel={"Size"}
                    renderOption={(getOption, getFlags) => (
                        <PageSelectOptionContent isGliding flags={getFlags}>
                            {getOption().value}
                        </PageSelectOptionContent>
                    )}
                />
            </PageListboxSurface>
        </div>
    );
};
