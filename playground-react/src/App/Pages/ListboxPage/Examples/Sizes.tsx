import { Listbox } from "@thewaver/ss-components-react";

import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { SIZES } from "../ListboxPage.const";
import type { ListboxExampleProps } from "../ListboxPage.types";

type Props = ListboxExampleProps;

export const SizesExample = (props: Props) => (
    <div dir="rtl">
        <PageListboxSurface isWide={true}>
            <Listbox
                valueState={props.valueState}
                options={SIZES}
                orientation={"horizontal"}
                ariaLabel={"Size"}
                renderOption={(option, flags) => (
                    <PageSelectOptionContent flags={flags}>{option.value}</PageSelectOptionContent>
                )}
            />
        </PageListboxSurface>
    </div>
);
