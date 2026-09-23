import { MultiListbox } from "@thewaver/ss-components";

import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { GROUPED_COUNTRIES } from "../../SelectPage/SelectPage.const";
import type { MultiListboxExampleProps } from "../ListboxPage.types";

type Props = MultiListboxExampleProps;

export const GroupedExample = (props: Props) => (
    <PageListboxSurface>
        <MultiListbox
            valuesSignal={props.valuesSignal}
            options={() => GROUPED_COUNTRIES}
            ariaLabel={"Countries to ship to"}
            renderGroup={(getGroup, getFlags) => (
                <PageSelectGroupContent flags={getFlags}>{getGroup().label}</PageSelectGroupContent>
            )}
            renderOption={(getOption, getFlags) => (
                <PageSelectOptionContent flags={getFlags}>{getOption().value}</PageSelectOptionContent>
            )}
        />
    </PageListboxSurface>
);
