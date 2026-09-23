import { MultiSelect } from "@thewaver/ss-components";

import { PageSelectClear } from "../../../StyledComponents/SelectClear/SelectClear";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../../SelectPage/SelectPage.const";
import type { MultiSelectClearableExampleProps } from "../MultiSelectPage.types";

type Props = MultiSelectClearableExampleProps;

export const MultiSelectClearableExample = (props: Props) => (
    <MultiSelect
        valuesSignal={props.valuesSignal}
        options={() => COUNTRIES}
        ariaLabel={"Countries"}
        clearAriaLabel={"Clear countries"}
        padding={() => QUERY_PADDING}
        renderContent={(getSelectedOptions, getFlags) => (
            <PageSelectContent flags={getFlags} hasClearSpace={true}>
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
        renderClear={(getFlags) => <PageSelectClear flags={getFlags} />}
        renderPopup={renderSelectPopup}
        onSelectionChange={props.onSelectionChange}
    />
);
