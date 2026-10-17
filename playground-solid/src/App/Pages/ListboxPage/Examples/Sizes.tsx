import { Listbox } from "@thewaver/ss-components-solid";
import { SIZES } from "@thewaver/ss-playground/App/Pages/ListboxPage/ListboxPage.const";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
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
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent isGliding flags={getFlags}>
                        {getOption().value}
                    </PageSelectOptionContent>
                )}
            />
        </PageListboxSurface>
    </div>
);
