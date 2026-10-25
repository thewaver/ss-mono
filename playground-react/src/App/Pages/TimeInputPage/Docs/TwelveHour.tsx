import { useState } from "react";

import { TimeInput } from "@thewaver/ss-components-react";
import { TIME_SEGMENT_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import { PageMeridiemToggle } from "../../../PageComponents/MeridiemToggle/MeridiemToggle";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TimeInputTwelveHourDocsExampleProps } from "../TimeInputPageReact.types";

type Props = TimeInputTwelveHourDocsExampleProps;

export const TwelveHourDocsExample = (props: Props) => {
    const valueState = useState<TimeValue | undefined>({ hour: 14, minute: 30 });

    const valueText = valueState[0] ? TimeUtils.toIso(valueState[0]) : "nothing";

    return (
        <>
            <TimeInput
                value={valueState}
                isTwelveHour={props.isTwelveHour}
                ariaLabel={"Meeting time"}
                segmentHints={TIME_SEGMENT_HINTS}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
                renderTrailing={(flags, meridiem) =>
                    props.isTwelveHour && (
                        <PageMeridiemToggle
                            meridiem={meridiem.value}
                            isDisabled={flags.isDisabled ?? false}
                            onToggle={meridiem.toggle}
                        />
                    )
                }
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueText}`}
            </div>
        </>
    );
};
