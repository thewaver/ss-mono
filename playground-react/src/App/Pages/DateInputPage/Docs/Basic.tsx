import { useState } from "react";

import type { DateValue } from "@thewaver/ss-components-react";
import { DateInput, DateValueUtils } from "@thewaver/ss-components-react";
import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { DateInputBasicDocsExampleProps } from "../DateInputPageReact.types";

type Props = DateInputBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState<DateValue | undefined>();

    const valueText = valueState[0] ? DateValueUtils.toIso(valueState[0]) : "nothing";

    return (
        <>
            <DateInput
                value={valueState}
                isReadOnly={props.isReadOnly}
                hasError={props.hasError}
                isDisabled={props.isDisabled}
                locale={LOCALE}
                ariaLabel={"Start date"}
                partHints={DATE_PART_HINTS}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
                renderPlaceholder={(flags, hint) => (
                    <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
                )}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueText}`}
            </div>
        </>
    );
};
