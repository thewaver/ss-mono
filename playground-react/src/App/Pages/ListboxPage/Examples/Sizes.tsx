import { Listbox } from "@thewaver/ss-components-react";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { SIZES } from "../ListboxPage.const";
import type { ListboxExampleProps } from "../ListboxPage.types";

type Props = ListboxExampleProps;

export const SizesExample = (props: Props) => (
    <div dir="rtl">
        <PageListboxSurface isWide={true}>
            <Listbox
                renderHighlightFloater={renderPageHighlightFloater}
                value={props.value}
                options={SIZES}
                orientation={"horizontal"}
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
