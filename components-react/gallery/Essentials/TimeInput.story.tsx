import { useState } from "react";

import type { InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";
import { TimeUtils, type TimeValue } from "@thewaver/ss-utils";

import { Button, TimeInput, type TimeInputMeridiem } from "../../src";

const SEGMENT_HINTS = { hour: "hh", minute: "mm", second: "ss" };
const OPENING_TIME: TimeValue = { hour: 9, minute: 0 };
const CLOSING_TIME: TimeValue = { hour: 17, minute: 30 };

const FIELD_WIDTH = 240;
const FIELD_HEIGHT = 32;
const FIELD_PADDING = 8;

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

const describe = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

const MeridiemToggle = ({ meridiem, isDisabled }: { meridiem: TimeInputMeridiem; isDisabled: boolean }) => (
    <Button
        id="meridiem"
        isDisabled={isDisabled}
        ariaLabel={`Before or after noon: ${meridiem.value === "am" ? "AM" : "PM"}`}
        renderContent={() => <span>{meridiem.value}</span>}
        onClick={meridiem.toggle}
    />
);

type ExampleProps = {
    initial?: TimeValue;
    isTwelveHour?: boolean;
    hasSeconds?: boolean;
    isDisabled?: boolean;
    minValue?: TimeValue;
    maxValue?: TimeValue;
};

const Example = (props: ExampleProps) => {
    const valueState = useState<TimeValue | undefined>(props.initial);

    return (
        <>
            <TimeInput
                id="field"
                valueState={valueState}
                isTwelveHour={props.isTwelveHour}
                hasSeconds={props.hasSeconds}
                isDisabled={props.isDisabled}
                minValue={props.minValue}
                maxValue={props.maxValue}
                ariaLabel="Time"
                segmentHints={SEGMENT_HINTS}
                padding={FIELD_PADDING}
                renderContent={renderFrame}
                renderPlaceholder={(flags, hint) =>
                    flags.isEmpty ? <span data-testid="placeholder">{hint}</span> : null
                }
                renderTrailing={
                    props.isTwelveHour
                        ? (flags, meridiem) => (
                              <MeridiemToggle meridiem={meridiem} isDisabled={flags.isDisabled ?? false} />
                          )
                        : undefined
                }
            />
            <input data-testid="elsewhere" aria-label="Elsewhere" />
            <output data-readout="value">{describe(valueState[0])}</output>
        </>
    );
};

export const Default = (props: { isDisabled?: boolean }) => (
    <Example initial={{ hour: 9, minute: 30 }} isDisabled={props.isDisabled} />
);

export const TwelveHour = () => <Example initial={{ hour: 14, minute: 30 }} isTwelveHour={true} />;

export const EmptyTwelveHour = () => <Example isTwelveHour={true} />;

export const Seconds = () => <Example initial={{ hour: 9, minute: 30, second: 0 }} hasSeconds={true} />;

export const Shift = () => <Example minValue={OPENING_TIME} maxValue={CLOSING_TIME} />;
