import { useState } from "react";

import type { ClockSteps, InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";
import { TimeUtils, type TimeValue } from "@thewaver/ss-utils";

import { Button, TimePicker } from "../../src";

const LOCALE = "en-GB";
const SEGMENT_HINTS = { hour: "hh", minute: "mm", second: "ss" };
const OPENING_TIME: TimeValue = { hour: 9, minute: 0 };
const CLOSING_TIME: TimeValue = { hour: 17, minute: 30 };
const BOOKING_STEPS: ClockSteps = { minute: 15 };
const FIELD_WIDTH = 240;
const FIELD_HEIGHT = 32;
const FIELD_PADDING = 8;

const describe = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

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

type ExampleProps = {
    initial?: TimeValue;
    isTwelveHour?: boolean;
    isDisabled?: boolean;
    clockSteps?: ClockSteps;
    minValue?: TimeValue;
    maxValue?: TimeValue;
};

const Example = (props: ExampleProps) => {
    const valueState = useState<TimeValue | undefined>(props.initial);

    return (
        <>
            <input data-testid="elsewhere" aria-label="Elsewhere" />
            <TimePicker
                id="field"
                valueState={valueState}
                isTwelveHour={props.isTwelveHour}
                isDisabled={props.isDisabled}
                clockSteps={props.clockSteps}
                minValue={props.minValue}
                maxValue={props.maxValue}
                ariaLabel="Time"
                clockLabel="Choose a time"
                segmentHints={SEGMENT_HINTS}
                locale={LOCALE}
                padding={FIELD_PADDING}
                renderContent={renderFrame}
                renderTrailing={(flags, meridiem) =>
                    props.isTwelveHour ? (
                        <Button
                            id="meridiem"
                            isDisabled={flags.isDisabled}
                            ariaLabel={`Before or after noon: ${meridiem.value === "am" ? "AM" : "PM"}`}
                            renderContent={() => <span>{meridiem.value}</span>}
                            onClick={meridiem.toggle}
                        />
                    ) : null
                }
                triggerId="trigger"
                triggerAriaLabel="Open the clock"
                renderTrigger={(flags, meridiem) => (
                    <span data-testid="trigger-content">{`${flags.isOpen ? "Close" : "Open"} ${meridiem.value}`}</span>
                )}
                renderOption={(option) => <span>{option.label}</span>}
                renderUnit={(name) => <span>{name}</span>}
                renderPopup={(renderClock) => <div style={{ background: "white" }}>{renderClock()}</div>}
            />
            <output data-readout="value">{describe(valueState[0])}</output>
        </>
    );
};

export const Clocked = (props: { isDisabled?: boolean }) => (
    <Example initial={{ hour: 9, minute: 30 }} isDisabled={props.isDisabled} />
);

export const ClockedTwelve = () => <Example initial={{ hour: 14, minute: 30 }} isTwelveHour={true} />;

export const Booking = () => (
    <Example
        initial={{ hour: 10, minute: 15 }}
        clockSteps={BOOKING_STEPS}
        minValue={OPENING_TIME}
        maxValue={CLOSING_TIME}
    />
);
