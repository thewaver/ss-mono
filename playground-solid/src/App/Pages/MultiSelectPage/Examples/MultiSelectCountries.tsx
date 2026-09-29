import type { Signal } from "solid-js";

import { MultiSelect } from "@thewaver/ss-components-solid";

import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../../SelectPage/SelectPage.const";

type Props = {
    values: Signal<string[]>;
};

export const MultiSelectCountriesExample = (props: Props) => (
    <MultiSelect
        values={props.values}
        options={() => COUNTRIES}
        ariaLabel={"Countries"}
        renderContent={(getSelectedOptions, getFlags) => (
            <PageSelectContent flags={getFlags}>
                {getSelectedOptions().length
                    ? getSelectedOptions()
                          .map((option) => option.value)
                          .join(", ")
                    : PLACEHOLDER}
            </PageSelectContent>
        )}
        renderOption={(getOption, getFlags) => (
            <PageSelectOptionContent flags={getFlags}>{getOption().value}</PageSelectOptionContent>
        )}
        renderPopup={renderSelectPopup}
    />
);
