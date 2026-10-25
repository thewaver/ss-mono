import { useState } from "react";

import type { DateValue } from "@thewaver/ss-components-react";
import { DateInput } from "@thewaver/ss-components-react";
import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageEraCycle } from "../../../PageComponents/EraCycle/EraCycle";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

export const RightToLeftDocsExample = () => {
    const valueState = useState<DateValue | undefined>(TODAY);

    return (
        <div dir={"rtl"}>
            <DateInput
                value={valueState}
                locale={LOCALE}
                ariaLabel={"Date in a right-to-left box"}
                partHints={DATE_PART_HINTS}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
                renderPlaceholder={(flags, hint) => (
                    <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
                )}
                renderLeading={(flags, era) => (
                    <PageEraCycle
                        era={era.value}
                        options={era.options}
                        isDisabled={flags.isDisabled ?? false}
                        onChange={era.set}
                    />
                )}
            />
        </div>
    );
};
