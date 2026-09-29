import { Label, Select } from "@thewaver/ss-components-react";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { COUNTRIES, PLACEHOLDER, renderSelectPopup } from "../SelectPage.const";
import type { SelectExampleProps } from "../SelectPage.types";

const LABEL_GAP = 5;

type Props = SelectExampleProps;

export const LabeledExample = (props: Props) => {
    return (
        <Label orientation={"vertical"} gap={LABEL_GAP}>
            <PageLabelCaption>Country</PageLabelCaption>

            <Select
                value={props.value}
                options={COUNTRIES}
                listAriaLabel={"Country"}
                renderContent={(selectedOption, flags) => (
                    <PageSelectContent flags={flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
                )}
                renderOption={(option, flags) => (
                    <PageSelectOptionContent flags={flags}>{option.value}</PageSelectOptionContent>
                )}
                renderPopup={renderSelectPopup}
            />
        </Label>
    );
};
