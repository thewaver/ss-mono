import { Select } from "@thewaver/ss-components-react";

import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { HOURS, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const";
import type { SelectExampleProps } from "../SelectPage.types";

type Props = SelectExampleProps;

export const HoursExample = (props: Props) => {
    return (
        <Select
            valueState={props.valueState}
            options={HOURS}
            ariaLabel={"Departure hour"}
            renderContent={(selectedOption, flags) => (
                <PageSelectContent flags={flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
            )}
            renderOption={(option, flags) => (
                <PageSelectOptionContent flags={flags}>{option.value}</PageSelectOptionContent>
            )}
            renderPopup={renderSelectPopup}
        />
    );
};
