import { useState } from "react";

import {
    type DateInputFormat,
    type DateValue,
    type DateValueCalendarId,
    DateValueUtils,
    type InteractionFlags,
    type TextFieldFlags,
} from "@thewaver/ss-components";

import { Button, DateInput, type DateInputEra } from "../../src";

const LOCALE = "en-GB";
const TODAY = DateValueUtils.fromIso("2026-08-10")!;
const CAESAR = DateValueUtils.fromIso("-000043-03-15")!;
const PART_HINTS = { year: "yyyy", month: "mm", day: "dd" };
const SINGLE_ERA = 1;

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

const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

const EraCycle = ({ era, isDisabled }: { era: DateInputEra; isDisabled: boolean }) => {
    if (era.options.length <= SINGLE_ERA) return null;

    const index = era.options.findIndex((option) => option.id === era.value);
    const current = era.options[index];

    return (
        <Button
            isDisabled={isDisabled}
            ariaLabel={`Era: ${current?.name ?? era.value}`}
            renderContent={() => <span>{current?.shortName ?? era.value}</span>}
            onClick={() => era.set(era.options[(index + 1) % era.options.length].id)}
        />
    );
};

type ExampleProps = {
    calendarId?: DateValueCalendarId;
    isDisabled?: boolean;
};

const Example = (props: ExampleProps & { initial?: DateValue; format?: DateInputFormat; minValue?: DateValue }) => {
    const valueState = useState<DateValue | undefined>(props.initial);

    return (
        <>
            <DateInput
                id="field"
                valueState={valueState}
                calendar={props.calendarId}
                format={props.format}
                minValue={props.minValue}
                isDisabled={props.isDisabled}
                locale={LOCALE}
                ariaLabel="Date"
                partHints={PART_HINTS}
                padding={FIELD_PADDING}
                renderContent={renderFrame}
                renderPlaceholder={(flags, hint) =>
                    flags.isEmpty ? <span data-testid="placeholder">{hint}</span> : null
                }
                renderLeading={(flags, era) => <EraCycle era={era} isDisabled={flags.isDisabled ?? false} />}
            />
            <input data-testid="elsewhere" aria-label="Elsewhere" />
            <output data-readout="value">{describe(valueState[0])}</output>
        </>
    );
};

export const Typed = (props: ExampleProps) => <Example {...props} initial={TODAY} />;

export const DayFirst = (props: ExampleProps) => <Example {...props} initial={TODAY} format="day-month-year" />;

export const MonthFirst = (props: ExampleProps) => <Example {...props} format="month-day-year" />;

export const Era = (props: ExampleProps) => <Example {...props} initial={CAESAR} />;

export const Empty = (props: ExampleProps) => <Example {...props} />;
