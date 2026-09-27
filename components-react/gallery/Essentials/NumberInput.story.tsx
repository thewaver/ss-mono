import { useState } from "react";

import type { InteractionFlags, NumberInputStepper, TextFieldFlags } from "@thewaver/ss-components";

import { Button, NumberInput } from "../../src";

const FIELD_WIDTH = 240;
const FIELD_HEIGHT = 32;
const FIELD_PADDING = 8;
const STEPPER_BUTTON_WIDTH = 72;

const QUANTITY_MIN = 0;
const QUANTITY_MAX = 100;
const QUANTITY_STEP = 5;
const RATING_MIN = 0;
const RATING_MAX = 5;
const RATING_STEP = 0.1;
const GERMAN_LOCALE = "de-DE";
const AMOUNT_STEP = 0.5;

type Flags = InteractionFlags<TextFieldFlags>;

const Frame = ({ flags }: { flags: Flags }) => (
    <div
        style={{
            width: FIELD_WIDTH,
            height: FIELD_HEIGHT,
            border: "1px solid black",
            opacity: flags.isDisabled ? 0.5 : 1,
        }}
    />
);

const renderFrame = (flags: Flags) => <Frame flags={flags} />;

const StepperButton = (props: {
    label: string;
    isDisabled: boolean;
    onStart: () => boolean;
    onStop: () => boolean;
}) => (
    <Button
        isDisabled={props.isDisabled}
        onPointerDown={() => props.onStart()}
        onPointerUp={() => props.onStop()}
        onMouseLeave={() => props.onStop()}
        renderContent={() => <span style={{ display: "block", width: STEPPER_BUTTON_WIDTH }}>{props.label}</span>}
    />
);

const Stepper = ({ flags, stepper }: { flags: Flags; stepper: NumberInputStepper }) => {
    const isLocked = (flags.isDisabled ?? false) || flags.isReadOnly;

    return (
        <span style={{ display: "flex" }}>
            <StepperButton
                label="Increase"
                isDisabled={isLocked || stepper.getIsAtMax()}
                onStart={stepper.startSteppingUp}
                onStop={stepper.stopStepping}
            />
            <StepperButton
                label="Decrease"
                isDisabled={isLocked || stepper.getIsAtMin()}
                onStart={stepper.startSteppingDown}
                onStop={stepper.stopStepping}
            />
        </span>
    );
};

const renderStepper = (flags: Flags, stepper: NumberInputStepper) => <Stepper flags={flags} stepper={stepper} />;

const Readout = ({ value }: { value: number | undefined }) => (
    <output data-readout="value">{`value: ${String(value)}`}</output>
);

export const Default = () => {
    const valueState = useState<number | undefined>(undefined);

    return (
        <>
            <NumberInput
                id="field"
                ariaLabel="How many"
                padding={FIELD_PADDING}
                valueState={valueState}
                renderContent={renderFrame}
                renderPlaceholder={() => <span>How many</span>}
                renderTrailing={renderStepper}
            />
            <Readout value={valueState[0]} />
        </>
    );
};

export const SteppedClamped = () => {
    const valueState = useState<number | undefined>(13);

    return (
        <>
            <NumberInput
                id="field"
                ariaLabel="Quantity"
                min={QUANTITY_MIN}
                max={QUANTITY_MAX}
                step={QUANTITY_STEP}
                padding={FIELD_PADDING}
                valueState={valueState}
                renderContent={renderFrame}
                renderTrailing={renderStepper}
            />
            <Readout value={valueState[0]} />
        </>
    );
};

export const FractionalStep = () => {
    const valueState = useState<number | undefined>(3.7);

    return (
        <NumberInput
            id="field"
            ariaLabel="Rating"
            min={RATING_MIN}
            max={RATING_MAX}
            step={RATING_STEP}
            padding={FIELD_PADDING}
            valueState={valueState}
            renderContent={renderFrame}
            renderTrailing={renderStepper}
        />
    );
};

export const German = () => {
    const valueState = useState<number | undefined>(1234.5);

    return (
        <>
            <NumberInput
                id="field"
                ariaLabel="Amount"
                locale={GERMAN_LOCALE}
                step={AMOUNT_STEP}
                padding={FIELD_PADDING}
                valueState={valueState}
                renderContent={renderFrame}
                renderTrailing={renderStepper}
            />
            <Readout value={valueState[0]} />
        </>
    );
};

export const ReadOnly = () => {
    const valueState = useState<number | undefined>(1024);

    return (
        <NumberInput
            id="field"
            ariaLabel="Read-only amount"
            isReadOnly={true}
            padding={FIELD_PADDING}
            valueState={valueState}
            renderContent={renderFrame}
            renderTrailing={renderStepper}
        />
    );
};

export const Disabled = () => {
    const valueState = useState<number | undefined>(7);

    return (
        <NumberInput
            id="field"
            ariaLabel="Disabled amount"
            isDisabled={true}
            padding={FIELD_PADDING}
            valueState={valueState}
            renderContent={renderFrame}
            renderTrailing={renderStepper}
        />
    );
};
