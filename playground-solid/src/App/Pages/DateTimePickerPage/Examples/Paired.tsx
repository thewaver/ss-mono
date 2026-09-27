import { DateInput, DateTimeValueSolidUtils, TimeInput } from "@thewaver/ss-components-solid";
import {
    DATE_PART_HINTS,
    TIME_SEGMENT_HINTS,
} from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground-core/App/Pages/DatePickerPage/DatePickerPage.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/DateTimePickerPage/DateTimePickerPage.css";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { DateTimeExampleProps } from "../DateTimePickerPage.types";

type Props = DateTimeExampleProps;

export const PairedExample = (props: Props) => {
    const { dateSignal, timeSignal } = DateTimeValueSolidUtils.createSplit(props.valueSignal);

    return (
        <div class={styles.dateTimeRow}>
            <DateInput
                valueSignal={dateSignal}
                ariaLabel={"Date"}
                partHints={DATE_PART_HINTS}
                locale={() => LOCALE}
                padding={() => FIELD_STEPPER_PADDING}
                gap={() => FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} />}
                renderPlaceholder={(getFlags, hint) => (
                    <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
                )}
            />

            <TimeInput
                valueSignal={timeSignal}
                ariaLabel={"Time"}
                segmentHints={TIME_SEGMENT_HINTS}
                padding={() => FIELD_STEPPER_PADDING}
                gap={() => FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} />}
                renderPlaceholder={(getFlags, hint) => (
                    <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
                )}
            />
        </div>
    );
};
