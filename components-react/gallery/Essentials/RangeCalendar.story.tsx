import { useState } from "react";

import { type DateValue, type DateValueRange, DateValueUtils } from "@thewaver/ss-components";

import { RangeCalendar } from "../../src";

const LOCALE = "en-GB";
const TODAY = DateValueUtils.fromIso("2026-08-10")!;
const MIN_DATE = DateValueUtils.fromIso("2026-08-05")!;
const MAX_DATE = DateValueUtils.fromIso("2026-08-20")!;

const describe = (range: DateValueRange | undefined) =>
    range ? `${DateValueUtils.toIso(range.start)} to ${DateValueUtils.toIso(range.end)}` : "none";

const Example = (props: { minValue?: DateValue; maxValue?: DateValue }) => {
    const valueState = useState<DateValueRange | undefined>(undefined);
    const monthState = useState(() => DateValueUtils.getStartOfMonth(TODAY));

    return (
        <>
            <RangeCalendar
                valueState={valueState}
                monthState={monthState}
                today={TODAY}
                locale={LOCALE}
                minValue={props.minValue}
                maxValue={props.maxValue}
                ariaLabel="Choose a range"
                renderDay={(day, flags) => (
                    <span
                        data-in-range={flags.isInRange || undefined}
                        data-range-start={flags.isRangeStart || undefined}
                        data-range-end={flags.isRangeEnd || undefined}
                    >
                        {day.day}
                    </span>
                )}
                renderWeekday={(name) => <span>{name}</span>}
            />
            <output data-readout="value">{describe(valueState[0])}</output>
        </>
    );
};

export const Default = () => <Example />;

export const Bounded = () => <Example minValue={MIN_DATE} maxValue={MAX_DATE} />;
