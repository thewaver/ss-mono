import { MultiSelect } from "@thewaver/ss-components-react";

import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../../SelectPage/SelectPage.const";

type Props = {
    values: readonly [string[], (values: string[]) => void];
};

export const MultiSelectCountriesExample = (props: Props) => (
    <MultiSelect
        values={props.values}
        options={COUNTRIES}
        ariaLabel={"Countries"}
        renderContent={(selectedOptions, flags) => (
            <PageSelectContent flags={flags}>
                {selectedOptions.length ? selectedOptions.map((option) => option.value).join(", ") : PLACEHOLDER}
            </PageSelectContent>
        )}
        renderOption={(option, flags) => (
            <PageSelectOptionContent flags={flags}>{option.value}</PageSelectOptionContent>
        )}
        renderPopup={renderSelectPopup}
    />
);
