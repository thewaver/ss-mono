import { TimeInput } from "@thewaver/ss-components-react";
import { TIME_SEGMENT_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import type { TimeValue } from "@thewaver/ss-utils";

import { PageMeridiemToggle } from "../../../PageComponents/MeridiemToggle/MeridiemToggle";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { TimeExampleProps } from "../../DatePickerPage/DatePickerPage.types";

type Props = TimeExampleProps & {
    ariaLabel: string;
    isTwelveHour?: boolean;
    hasSeconds?: boolean;
    minValue?: TimeValue;
    maxValue?: TimeValue;
};

export const TimeExample = (props: Props) => {
    return (
        <TimeInput
            valueState={props.valueState}
            isTwelveHour={props.isTwelveHour}
            hasSeconds={props.hasSeconds}
            minValue={props.minValue}
            maxValue={props.maxValue}
            ariaLabel={props.ariaLabel}
            segmentHints={TIME_SEGMENT_HINTS}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
            renderPlaceholder={(flags, hint) => (
                <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
            )}
            renderTrailing={
                props.isTwelveHour
                    ? (flags, meridiem) => (
                          <PageMeridiemToggle
                              meridiem={meridiem.value}
                              isDisabled={flags.isDisabled ?? false}
                              onToggle={meridiem.toggle}
                          />
                      )
                    : undefined
            }
        />
    );
};
