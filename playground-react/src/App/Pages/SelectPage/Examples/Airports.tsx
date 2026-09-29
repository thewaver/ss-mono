import { Select } from "@thewaver/ss-components-react";

import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { AIRPORTS, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const";
import type { SelectAirportExampleProps } from "../SelectPage.types";

type Props = SelectAirportExampleProps;

export const AirportsExample = (props: Props) => (
    <Select
        value={props.value}
        options={AIRPORTS}
        ariaLabel={"Airport"}
        renderContent={(selectedOption, flags) => (
            <PageSelectContent flags={flags}>
                {selectedOption ? selectedOption.value.city : PLACEHOLDER}
            </PageSelectContent>
        )}
        renderOption={(option, flags) => (
            <PageSelectOptionContent flags={flags}>
                {option.value.city} ({option.value.code})
            </PageSelectOptionContent>
        )}
        renderPopup={renderSelectPopup}
    />
);
