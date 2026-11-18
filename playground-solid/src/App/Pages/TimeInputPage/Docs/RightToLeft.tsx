import { createSignal } from "solid-js";

import { TimeInput } from "@thewaver/ss-components-solid";
import { TIME_SEGMENT_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import { TIME_RIGHT_LEFT_BOX_LABEL } from "@thewaver/ss-playground/App/Pages/TimeInputPage/TimeInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import type { TimeValue } from "@thewaver/ss-utils";

import { PageMeridiemToggle } from "../../../PageComponents/MeridiemToggle/MeridiemToggle";
import { PageTextFieldContent } from "../../../StyledComponents/TextFieldContent/TextFieldContent";

export const RightToLeftDocsExample = () => {
    const valueSignal = createSignal<TimeValue | undefined>({ hour: 14, minute: 30 });

    return (
        <div dir={"rtl"}>
            <TimeInput
                value={valueSignal}
                isTwelveHour={true}
                ariaLabel={TIME_RIGHT_LEFT_BOX_LABEL}
                segmentHints={TIME_SEGMENT_HINTS}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
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
