import { createSignal } from "solid-js";

import { TimeInput } from "@thewaver/ss-components-solid";
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

export const RightToLeftDocsExample = () => {
    const valueSignal = createSignal<TimeValue | undefined>({ hour: 14, minute: 30 });

    return (
        <div dir={"rtl"}>
            <TimeInput
                value={valueSignal}
                isTwelveHour={true}
                ariaLabel={"Time in a right-to-left box"}
                segmentHints={TIME_SEGMENT_HINTS}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
                renderTrailing={(getFlags, meridiem) => (
                    <PageMeridiemToggle
                        meridiem={meridiem.getValue}
                        isDisabled={() => getFlags().isDisabled ?? false}
                        onToggle={meridiem.toggle}
                    />
                )}
            />
        </div>
    );
};
