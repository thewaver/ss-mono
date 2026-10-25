import { useState } from "react";

import { Clock } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import {
    PageClockColumn,
    PageClockFrame,
    PageClockOption,
    PageClockUnit,
} from "../../../StyledComponents/ClockContent/ClockContent";
import type { ClockTwelveHourDocsExampleProps } from "../ClockPageReact.types";

type Props = ClockTwelveHourDocsExampleProps;

export const TwelveHourDocsExample = (props: Props) => {
    const valueState = useState<TimeValue | undefined>({ hour: 14, minute: 30 });

    const [value] = valueState;

    const valueText = value ? TimeUtils.toIso(value) : "nothing";

    return (
        <>
            <PageClockFrame>
                <Clock
                    value={valueState}
                    locale={LOCALE}
                    isTwelveHour={props.isTwelveHour}
                    ariaLabel={"Call time"}
                    renderOption={(_unused, renderProps) => <PageClockOption renderProps={renderProps} />}
                    renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
                    renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
                />
            </PageClockFrame>

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueText}`}
            </div>
        </>
    );
};
