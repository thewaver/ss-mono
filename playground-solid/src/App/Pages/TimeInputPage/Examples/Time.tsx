import { TimeInput, access } from "@thewaver/ss-components-solid";
import type { MaybeAccessor } from "@thewaver/ss-components-solid";
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
    ariaLabel: MaybeAccessor<string>;
    isTwelveHour?: MaybeAccessor<boolean>;
    hasSeconds?: MaybeAccessor<boolean>;
    minValue?: MaybeAccessor<TimeValue>;
    maxValue?: MaybeAccessor<TimeValue>;
};

export const TimeExample = (props: Props) => {
    return (
        <TimeInput
            valueSignal={props.valueSignal}
            isTwelveHour={props.isTwelveHour}
            hasSeconds={props.hasSeconds}
            minValue={props.minValue}
            maxValue={props.maxValue}
            ariaLabel={props.ariaLabel}
            segmentHints={TIME_SEGMENT_HINTS}
            padding={() => FIELD_STEPPER_PADDING}
            gap={() => FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} />}
            renderPlaceholder={(getFlags, hint) => (
                <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
            )}
            renderTrailing={
                access(props.isTwelveHour)
                    ? (getFlags, meridiem) => (
                          <PageMeridiemToggle
                              meridiem={meridiem.getValue}
                              isDisabled={() => getFlags().isDisabled ?? false}
                              onToggle={meridiem.toggle}
                          />
                      )
                    : undefined
            }
        />
    );
};
