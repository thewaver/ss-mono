import { useState } from "react";

import { Clock } from "@thewaver/ss-components-react";
import { LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import type { TimeValue } from "@thewaver/ss-utils";

import {
    PageClockColumn,
    PageClockFrame,
    PageClockOption,
    PageClockUnit,
} from "../../../StyledComponents/ClockContent/ClockContent";
import type { ClockBasicDocsExampleProps } from "../ClockPageReact.types";

type Props = ClockBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState<TimeValue | undefined>({ hour: 9, minute: 30 });

    return (
        <PageClockFrame>
            <Clock
                value={valueState}
                locale={LOCALE}
                isDisabled={props.isDisabled}
                ariaLabel={"Appointment time"}
                renderOption={(_unused, renderProps) => <PageClockOption renderProps={renderProps} />}
                renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
                renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
            />
        </PageClockFrame>
    );
};
