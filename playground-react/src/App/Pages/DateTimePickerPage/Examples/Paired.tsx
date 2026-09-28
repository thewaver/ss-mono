import { DateInput, DateTimeValueReactUtils, TimeInput } from "@thewaver/ss-components-react";
import {
    DATE_PART_HINTS,
    TIME_SEGMENT_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/DateTimePickerPage/DateTimePickerPage.css";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { DateTimeExampleProps } from "../DateTimePickerPage.types";

type Props = DateTimeExampleProps;

export const PairedExample = (props: Props) => {
    const { dateState, timeState } = DateTimeValueReactUtils.useSplit(props.valueState);

    return (
        <div className={styles.dateTimeRow}>
            <DateInput
                valueState={dateState}
                ariaLabel={"Date"}
                partHints={DATE_PART_HINTS}
                locale={LOCALE}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
                renderPlaceholder={(flags, hint) => (
                    <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
                )}
            />

            <TimeInput
                valueState={timeState}
                ariaLabel={"Time"}
                segmentHints={TIME_SEGMENT_HINTS}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
                renderPlaceholder={(flags, hint) => (
                    <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
                )}
            />
        </div>
    );
};
