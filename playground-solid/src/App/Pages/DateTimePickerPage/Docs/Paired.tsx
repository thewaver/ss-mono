import { createSignal } from "solid-js";

import type { DateTimeValue } from "@thewaver/ss-components-solid";
import {
    DateInput,
    DateTimeValueSolidUtils,
    DateTimeValueUtils,
    DateValueUtils,
    TimeInput,
} from "@thewaver/ss-components-solid";
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
    const valueSignal = createSignal<DateTimeValue | undefined>(DateTimeValueUtils.of(TODAY, NOON));

    const { date: dateSignal, time: timeSignal } = DateTimeValueSolidUtils.createSplit(valueSignal);

    const getValueText = () => {
        const value = valueSignal[0]();

        return value ? `${DateValueUtils.toIso(value.date)} at ${TimeUtils.toIso(value.time)}` : "nothing";
    };

    return (
        <>
            <div class={styles.dateTimeRow}>
                <DateInput
                    value={dateSignal}
                    ariaLabel={"Date"}
                    partHints={DATE_PART_HINTS}
                    locale={LOCALE}
                    padding={FIELD_PADDING}
                    gap={FIELD_GAP}
                    computeTextStyle={computePageTextFieldTextStyle}
                    renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={PAIR_FIELD_WIDTH} />}
                    renderPlaceholder={(getFlags, hint) => (
                        <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
                    )}
                />

                <TimeInput
                    value={timeSignal}
                    ariaLabel={"Time"}
                    segmentHints={TIME_SEGMENT_HINTS}
                    padding={FIELD_PADDING}
                    gap={FIELD_GAP}
                    computeTextStyle={computePageTextFieldTextStyle}
                    renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={PAIR_FIELD_WIDTH} />}
                    renderPlaceholder={(getFlags, hint) => (
                        <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
                    )}
                />
            </div>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${getValueText()}`}
            </div>
        </>
    );
};
