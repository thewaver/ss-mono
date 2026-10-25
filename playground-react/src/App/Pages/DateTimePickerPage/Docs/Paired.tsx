import { useState } from "react";

import type { DateTimeValue } from "@thewaver/ss-components-react";
import {
    DateInput,
    DateTimeValueReactUtils,
    DateTimeValueUtils,
    DateValueUtils,
    TimeInput,
} from "@thewaver/ss-components-react";
import {
    DATE_PART_HINTS,
    TIME_SEGMENT_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { LOCALE, PAIR_FIELD_WIDTH, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import { NOON } from "@thewaver/ss-playground/App/Pages/DateTimePickerPage/DateTimePickerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/DateTimePickerPage/DateTimePickerPage.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import { TimeUtils } from "@thewaver/ss-utils";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

export const PairedDocsExample = () => {
    const valueState = useState<DateTimeValue | undefined>(DateTimeValueUtils.of(TODAY, NOON));

    const { date: dateState, time: timeState } = DateTimeValueReactUtils.useSplit(valueState);

    const [value] = valueState;

    const valueText = value ? `${DateValueUtils.toIso(value.date)} at ${TimeUtils.toIso(value.time)}` : "nothing";

    return (
        <>
            <div className={styles.dateTimeRow}>
                <DateInput
                    value={dateState}
                    ariaLabel={"Date"}
                    partHints={DATE_PART_HINTS}
                    locale={LOCALE}
                    padding={FIELD_PADDING}
                    gap={FIELD_GAP}
                    computeTextStyle={computePageTextFieldTextStyle}
                    renderContent={(flags) => <PageTextFieldContent flags={flags} width={PAIR_FIELD_WIDTH} />}
                    renderPlaceholder={(flags, hint) => (
                        <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
                    )}
                />

                <TimeInput
                    value={timeState}
                    ariaLabel={"Time"}
                    segmentHints={TIME_SEGMENT_HINTS}
                    padding={FIELD_PADDING}
                    gap={FIELD_GAP}
                    computeTextStyle={computePageTextFieldTextStyle}
                    renderContent={(flags) => <PageTextFieldContent flags={flags} width={PAIR_FIELD_WIDTH} />}
                    renderPlaceholder={(flags, hint) => (
                        <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
                    )}
                />
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueText}`}
            </div>
        </>
    );
};
