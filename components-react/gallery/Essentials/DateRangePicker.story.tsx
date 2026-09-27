import { useState } from "react";

import {
    CalendarUtils,
    type DateValue,
    type DateValueRange,
    DateValueUtils,
    type InteractionFlags,
    type TextFieldFlags,
} from "@thewaver/ss-components";

import { DateRangePicker } from "../../src";

const LOCALE = "en-GB";
const MIN_DATE = DateValueUtils.fromIso("2026-08-05")!;
const MAX_DATE = DateValueUtils.fromIso("2026-08-20")!;
const PART_HINTS = { year: "yyyy", month: "mm", day: "dd" };
const FIELD_WIDTH = 200;
const FIELD_HEIGHT = 32;
const FIELD_PADDING = 8;

const describe = (range: DateValueRange | undefined) =>
    range ? `${DateValueUtils.toIso(range.start)} to ${DateValueUtils.toIso(range.end)}` : "none";

const renderFrame = (flags: InteractionFlags<TextFieldFlags>) => (
    <div
        style={{
            width: FIELD_WIDTH,
            height: FIELD_HEIGHT,
            border: "1px solid black",
            opacity: flags.isDisabled ? 0.5 : 1,
        }}
    />
);

const Example = (props: { minValue?: DateValue; maxValue?: DateValue }) => {
    const valueState = useState<DateValueRange | undefined>(undefined);

    return (
        <>
            <input data-testid="elsewhere" aria-label="Elsewhere" />
            <DateRangePicker
                id="range"
                name="stay"
                valueState={valueState}
                minValue={props.minValue}
                maxValue={props.maxValue}
                startLabel="Start date"
                endLabel="End date"
                calendarLabel="Choose a range"
                partHints={PART_HINTS}
                locale={LOCALE}
                padding={FIELD_PADDING}
                renderContent={renderFrame}
                triggerId="trigger"
                triggerAriaLabel="Open the calendar"
                renderTrigger={() => <span>Open</span>}
                renderSeparator={() => <span data-testid="separator">to</span>}
                renderDay={(day) => <span>{day.day}</span>}
                renderWeekday={(name) => <span>{name}</span>}
                renderPopup={(renderCalendar, [month, setMonth]) => (
                    <div style={{ background: "white" }}>
                        <button
                            type="button"
                            id="nextPage"
                            onClick={() => setMonth(CalendarUtils.stepPage(month, "day", 1))}
                        >
                            Next
                        </button>
                        {renderCalendar()}
                    </div>
                )}
            />
            <output data-readout="value">{describe(valueState[0])}</output>
        </>
    );
};

export const Picked = () => <Example />;

export const Bounded = () => <Example minValue={MIN_DATE} maxValue={MAX_DATE} />;
