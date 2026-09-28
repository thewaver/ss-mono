import { Clock } from "@thewaver/ss-components-react";
import type { ClockSteps } from "@thewaver/ss-components-react";
import { LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import type { TimeValue } from "@thewaver/ss-utils";

import {
    PageClockColumn,
    PageClockFrame,
    PageClockOption,
    PageClockUnit,
} from "../../../StyledComponents/ClockContent/ClockContent";

type Props = {
    valueState: readonly [TimeValue | undefined, (value: TimeValue | undefined) => void];
    ariaLabel: string;
    isTwelveHour?: boolean;
    hasSeconds?: boolean;
    steps?: ClockSteps;
    minValue?: TimeValue;
    maxValue?: TimeValue;
};

export const DefaultExample = (props: Props) => {
    return (
        <PageClockFrame>
            <Clock
                valueState={props.valueState}
                locale={LOCALE}
                ariaLabel={props.ariaLabel}
                isTwelveHour={props.isTwelveHour}
                hasSeconds={props.hasSeconds}
                steps={props.steps}
                minValue={props.minValue}
                maxValue={props.maxValue}
                renderOption={(_unused, renderProps) => <PageClockOption renderProps={renderProps} />}
                renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
                renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
            />
        </PageClockFrame>
    );
};
