import { Show, createSignal } from "solid-js";

import { TimeInput, access } from "@thewaver/ss-components-solid";
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
import type { TimeInputTwelveHourDocsExampleProps } from "../TimeInputPageSolid.types";

type Props = TimeInputTwelveHourDocsExampleProps;

export const TwelveHourDocsExample = (props: Props) => {
    const valueSignal = createSignal<TimeValue | undefined>({ hour: 14, minute: 30 });

    const getValueText = () => {
        const value = valueSignal[0]();

        return value ? TimeUtils.toIso(value) : "nothing";
    };

    return (
        <>
            <TimeInput
                value={valueSignal}
                isTwelveHour={props.isTwelveHour}
                ariaLabel={"Meeting time"}
                segmentHints={TIME_SEGMENT_HINTS}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
                renderTrailing={(getFlags, meridiem) => (
                    <Show when={access(props.isTwelveHour)}>
                        <PageMeridiemToggle
                            meridiem={meridiem.getValue}
                            isDisabled={() => getFlags().isDisabled ?? false}
                            onToggle={meridiem.toggle}
                        />
                    </Show>
                )}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${getValueText()}`}
            </div>
        </>
    );
};
