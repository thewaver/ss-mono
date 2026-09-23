import { Select } from "@thewaver/ss-components";

import { PageSelectClear } from "../../../StyledComponents/SelectClear/SelectClear";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, QUERY_PADDING, renderSelectPopup } from "../SelectPage.const";
import type { SelectClearableExampleProps } from "../SelectPage.types";

type Props = SelectClearableExampleProps;

export const ClearableExample = (props: Props) => {
    return (
        <Select
            valueSignal={props.valueSignal}
            options={() => COUNTRIES}
            ariaLabel={"Country"}
            clearAriaLabel={"Clear country"}
            padding={() => QUERY_PADDING}
            renderContent={(getSelectedOption, getFlags) => (
                <PageSelectContent flags={getFlags} hasClearSpace={true}>
                    {getSelectedOption()?.value ?? PLACEHOLDER}
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
};
