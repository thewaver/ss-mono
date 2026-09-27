import { useState } from "react";

import {
    type DateTimeValue,
    DateTimeValueUtils,
    DateValueUtils,
    type InteractionFlags,
    type TextFieldFlags,
} from "@thewaver/ss-components";

import { DateInput, DateTimePicker, DateTimeValueReactUtils, TimeInput } from "../../src";

const LOCALE = "en-GB";
const TODAY = DateValueUtils.fromIso("2026-08-10")!;
const NOON = { hour: 12, minute: 0 };
const PART_HINTS = { year: "yyyy", month: "mm", day: "dd" };
const SEGMENT_HINTS = { hour: "hh", minute: "mm", second: "ss" };
const FIELD_WIDTH = 200;
const FIELD_HEIGHT = 32;
const FIELD_PADDING = 8;
const MIN_VALUE = DateTimeValueUtils.of(TODAY, { hour: 9, minute: 0 });

const pad = (value: number) => String(value).padStart(2, "0");

const describe = (value: DateTimeValue | undefined) =>
    value ? `${DateValueUtils.toIso(value.date)} at ${pad(value.time.hour)}:${pad(value.time.minute)}` : "none";

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

const PairedExample = (props: { initial?: DateTimeValue }) => {
    const valueState = useState<DateTimeValue | undefined>(props.initial);
    const { dateState, timeState } = DateTimeValueReactUtils.useSplit(valueState);

    return (
        <>
            <input data-testid="elsewhere" aria-label="Elsewhere" />
            <DateInput
                id="date"
                valueState={dateState}
                ariaLabel="Date"
                partHints={PART_HINTS}
                locale={LOCALE}
                padding={FIELD_PADDING}
                renderContent={renderFrame}
            />
            <TimeInput
                id="time"
                valueState={timeState}
                ariaLabel="Time"
                segmentHints={SEGMENT_HINTS}
                padding={FIELD_PADDING}
                renderContent={renderFrame}
            />
            <output data-readout="value">{describe(valueState[0])}</output>
        </>
    );
};

export const Paired = () => <PairedExample />;

export const Seeded = () => <PairedExample initial={DateTimeValueUtils.of(TODAY, NOON)} />;

const PickedExample = (props: { initial?: DateTimeValue; minValue?: DateTimeValue }) => {
    const valueState = useState<DateTimeValue | undefined>(props.initial);

    return (
        <>
            <input data-testid="elsewhere" aria-label="Elsewhere" />
            <DateTimePicker
                id="moment"
                name="moment"
                valueState={valueState}
                minValue={props.minValue}
                dateLabel="Date"
                timeLabel="Time"
                calendarLabel="Choose a date"
                clockLabel="Choose a time"
                partHints={PART_HINTS}
                segmentHints={SEGMENT_HINTS}
                locale={LOCALE}
                padding={FIELD_PADDING}
                renderContent={renderFrame}
                triggerId="dateTrigger"
                triggerAriaLabel="Open the calendar"
                timeTriggerId="timeTrigger"
                timeTriggerAriaLabel="Open the clock"
                renderSeparator={() => <span data-testid="separator">at</span>}
                renderTrigger={() => <span>Calendar</span>}
                renderTimeTrigger={() => <span>Clock</span>}
                renderDay={(day) => <span>{day.day}</span>}
                renderWeekday={(name) => <span>{name}</span>}
                renderPopup={(renderCalendar) => <div style={{ background: "white" }}>{renderCalendar()}</div>}
                renderOption={(option) => <span>{option.label}</span>}
                renderUnit={(name) => <span>{name}</span>}
                renderTimePopup={(renderClock) => <div style={{ background: "white" }}>{renderClock()}</div>}
            />
            <output data-readout="value">{describe(valueState[0])}</output>
        </>
    );
};

export const Picked = () => <PickedExample />;

export const Bounded = () => (
    <PickedExample initial={DateTimeValueUtils.of(TODAY, { hour: 10, minute: 0 })} minValue={MIN_VALUE} />
);
