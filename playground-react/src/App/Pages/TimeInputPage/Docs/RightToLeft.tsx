import { useState } from "react";

import { TimeInput } from "@thewaver/ss-components-react";
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
    const valueState = useState<TimeValue | undefined>({ hour: 14, minute: 30 });

    return (
        <div dir={"rtl"}>
            <TimeInput
                value={valueState}
                isTwelveHour={true}
                ariaLabel={TIME_RIGHT_LEFT_BOX_LABEL}
                segmentHints={TIME_SEGMENT_HINTS}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
                renderTrailing={(flags, meridiem) => (
                    <PageMeridiemToggle
                        meridiem={meridiem.value}
                        isDisabled={flags.isDisabled ?? false}
                        onToggle={meridiem.toggle}
                    />
                )}
            />
        </div>
    );
};
