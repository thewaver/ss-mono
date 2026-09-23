import { Listbox } from "@thewaver/ss-components";

import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPage.const";
import type { ListboxExampleProps } from "../ListboxPage.types";

type Props = ListboxExampleProps;

export const CountriesExample = (props: Props) => (
    <PageListboxSurface>
        <Listbox
            valueSignal={props.valueSignal}
            options={() => COUNTRIES_WITH_REACHABLE}
            ariaLabel={"Shipping country"}
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent flags={getFlags}>{getOption().value}</PageSelectOptionContent>
            )}
        />
    </PageListboxSurface>
);
