import { useState } from "react";

import type { ClockSteps } from "@thewaver/ss-components";
import { TimeUtils, type TimeValue } from "@thewaver/ss-utils";

import { Clock } from "../../src";

const LOCALE = "en-GB";
const NOW: TimeValue = { hour: 12, minute: 0 };
const LATE_NOW: TimeValue = { hour: 22, minute: 0 };
const OPENING_TIME: TimeValue = { hour: 9, minute: 0 };
const CLOSING_TIME: TimeValue = { hour: 17, minute: 30 };
const BOOKING_STEPS: ClockSteps = { minute: 15 };

const COLUMN_STYLE = { maxHeight: "160px", overflowY: "auto", display: "flex", flexDirection: "column" } as const;

const describe = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

type ExampleProps = {
    initial?: TimeValue;
    now?: TimeValue;
    isTwelveHour?: boolean;
    hasSeconds?: boolean;
    isDisabled?: boolean;
    steps?: ClockSteps;
    minValue?: TimeValue;
    maxValue?: TimeValue;
};

const Example = (props: ExampleProps) => {
    const valueState = useState<TimeValue | undefined>(props.initial);

    return (
        <>
            <Clock
                valueState={valueState}
                now={props.now ?? NOW}
                locale={LOCALE}
                isTwelveHour={props.isTwelveHour}
                hasSeconds={props.hasSeconds}
                isDisabled={props.isDisabled}
                steps={props.steps}
                minValue={props.minValue}
                maxValue={props.maxValue}
                ariaLabel="Choose a time"
                renderOption={(option, flags) => (
                    <span data-selected={flags.isSelected || undefined}>{option.label}</span>
                )}
                renderUnit={(name) => <span>{name}</span>}
                renderColumn={(renderOptions, unit) => (
                    <div data-column={unit} style={COLUMN_STYLE}>
                        {renderOptions()}
                    </div>
                )}
            />
            <output data-readout="value">{describe(valueState[0])}</output>
        </>
    );
};

export const Default = (props: { isDisabled?: boolean }) => (
    <Example initial={{ hour: 9, minute: 30 }} isDisabled={props.isDisabled} />
);

export const TwelveHour = () => <Example initial={{ hour: 14, minute: 30 }} isTwelveHour={true} />;

export const Seconds = () => <Example initial={{ hour: 9, minute: 30, second: 0 }} hasSeconds={true} />;

export const Booking = () => (
    <Example initial={{ hour: 10, minute: 15 }} steps={BOOKING_STEPS} minValue={OPENING_TIME} maxValue={CLOSING_TIME} />
);

export const Empty = () => <Example now={LATE_NOW} minValue={OPENING_TIME} maxValue={CLOSING_TIME} />;

export const RightToLeft = () => (
    <div dir="rtl">
        <Example initial={{ hour: 9, minute: 30 }} />
    </div>
);
