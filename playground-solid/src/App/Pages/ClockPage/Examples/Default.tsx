import type { Signal } from "solid-js";

import { Clock } from "@thewaver/ss-components-solid";
import type { ClockSteps, MaybeAccessor } from "@thewaver/ss-components-solid";
import { LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import type { TimeValue } from "@thewaver/ss-utils";

import {
    PageClockColumn,
    PageClockFrame,
    PageClockOption,
    PageClockUnit,
} from "../../../StyledComponents/ClockContent/ClockContent";

type Props = {
    value: Signal<TimeValue | undefined>;
    ariaLabel: MaybeAccessor<string>;
    isTwelveHour?: MaybeAccessor<boolean>;
    hasSeconds?: MaybeAccessor<boolean>;
    steps?: MaybeAccessor<ClockSteps>;
    minValue?: MaybeAccessor<TimeValue>;
    maxValue?: MaybeAccessor<TimeValue>;
};

export const DefaultExample = (props: Props) => {
    return (
        <PageClockFrame>
            <Clock
                value={props.value}
                locale={() => LOCALE}
                ariaLabel={props.ariaLabel}
                isTwelveHour={props.isTwelveHour}
                hasSeconds={props.hasSeconds}
                steps={props.steps}
                minValue={props.minValue}
                maxValue={props.maxValue}
                renderOption={(_unused, getRenderProps) => <PageClockOption renderProps={getRenderProps} />}
                renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
                renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
            />
        </PageClockFrame>
    );
};
