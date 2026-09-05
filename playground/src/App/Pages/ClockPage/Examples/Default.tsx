import type { Signal } from "solid-js";

import { Clock } from "@thewaver/ss-components";
import type { ClockSteps, MaybeAccessor } from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import {
    PageClockColumn,
    PageClockFrame,
    PageClockOption,
    PageClockUnit,
} from "../../../StyledComponents/ClockContent/ClockContent";
import { LOCALE } from "../../DatePickerPage/DatePickerPage.const";

type Props = {
    valueSignal: Signal<TimeValue | undefined>;
    ariaLabel: MaybeAccessor<string>;
    isTwelveHour?: MaybeAccessor<boolean>;
    hasSeconds?: MaybeAccessor<boolean>;
    steps?: MaybeAccessor<ClockSteps>;
    min?: MaybeAccessor<TimeValue>;
    max?: MaybeAccessor<TimeValue>;
};

export const DefaultExample = (props: Props) => {
    return (
        <PageClockFrame>
            <Clock
                valueSignal={props.valueSignal}
                locale={() => LOCALE}
                ariaLabel={props.ariaLabel}
                isTwelveHour={props.isTwelveHour}
                hasSeconds={props.hasSeconds}
                steps={props.steps}
                min={props.min}
                max={props.max}
                renderOption={(_unused, getRenderProps) => <PageClockOption renderProps={getRenderProps} />}
                renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
                renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
            />
        </PageClockFrame>
    );
};
