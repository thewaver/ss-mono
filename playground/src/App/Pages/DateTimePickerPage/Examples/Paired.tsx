import { DateInput, DateTimeValueUtils, TimeInput } from "@thewaver/ss-components";

import { DATE_PART_HINTS, TIME_SEGMENT_HINTS } from "../../../PageComponents/Announcements/Announcements.const";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { FIELD_WIDTH, LOCALE } from "../../DatePickerPage/DatePickerPage.const";
import type { DateTimeExampleProps } from "../DateTimePickerPage.types";

import { FIELD_GAP, FIELD_STEPPER_PADDING } from "../../../StyledComponents/TextFieldContent/TextFieldContent.css";
import * as styles from "../DateTimePickerPage.css";

type Props = DateTimeExampleProps;

export const PairedExample = (props: Props) => {
    const { dateSignal, timeSignal } = DateTimeValueUtils.createSplit(props.valueSignal);

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
