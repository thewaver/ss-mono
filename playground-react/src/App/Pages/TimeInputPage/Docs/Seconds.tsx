import { useState } from "react";

import { TimeInput } from "@thewaver/ss-components-react";
import { TIME_SEGMENT_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import type { TimeValue } from "@thewaver/ss-utils";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TimeInputSecondsDocsExampleProps } from "../TimeInputPageReact.types";

type Props = TimeInputSecondsDocsExampleProps;

export const SecondsDocsExample = (props: Props) => {
    const valueState = useState<TimeValue | undefined>({ hour: 9, minute: 30, second: 0 });

    return (
        <TimeInput
            value={valueState}
            hasSeconds={props.hasSeconds}
            ariaLabel={"Exact time"}
            segmentHints={TIME_SEGMENT_HINTS}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
        />
    );
};
