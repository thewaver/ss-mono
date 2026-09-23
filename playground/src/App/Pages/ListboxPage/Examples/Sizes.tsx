import { Listbox } from "@thewaver/ss-components";

import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { SIZES } from "../ListboxPage.const";
import type { ListboxExampleProps } from "../ListboxPage.types";

type Props = ListboxExampleProps;

export const SizesExample = (props: Props) => (
    <div dir="rtl">
        <PageListboxSurface isWide={true}>
            <Listbox
                valueSignal={props.valueSignal}
                options={() => SIZES}
                orientation={"horizontal"}
                ariaLabel={"Size"}
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent flags={getFlags}>{getOption().value}</PageSelectOptionContent>
                )}
            />
        </PageListboxSurface>
    </div>
);
