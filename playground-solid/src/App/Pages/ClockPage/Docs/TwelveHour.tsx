import { createSignal } from "solid-js";

import { Clock } from "@thewaver/ss-components-solid";
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
import type { ClockTwelveHourDocsExampleProps } from "../ClockPageSolid.types";

type Props = ClockTwelveHourDocsExampleProps;

export const TwelveHourDocsExample = (props: Props) => {
    const valueSignal = createSignal<TimeValue | undefined>({ hour: 14, minute: 30 });

    const getValueText = () => {
        const value = valueSignal[0]();

        return value ? TimeUtils.toIso(value) : "nothing";
    };

    return (
        <>
            <PageClockFrame>
                <Clock
                    value={valueSignal}
                    locale={LOCALE}
                    isTwelveHour={props.isTwelveHour}
                    ariaLabel={"Call time"}
                    renderOption={(_unused, getRenderProps) => <PageClockOption renderProps={getRenderProps} />}
                    renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
                    renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
                />
            </PageClockFrame>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${getValueText()}`}
            </div>
        </>
    );
};
