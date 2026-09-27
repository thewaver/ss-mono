import { useState } from "react";

import type { InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";

import { FormField, Label, TextField } from "../../src";

const FIELD_WIDTH = 240;
const FIELD_HEIGHT = 32;
const FIELD_PADDING = 8;
const PIN_LENGTH = 6;
const ADORNMENT_WIDTH = 24;

const Frame = ({ flags }: { flags: InteractionFlags<TextFieldFlags> }) => (
    <div
        data-testid="frame"
        style={{
            width: FIELD_WIDTH,
            height: FIELD_HEIGHT,
            border: "1px solid black",
            opacity: flags.isDisabled ? 0.5 : 1,
        }}
    />
);

const Readout = ({ value }: { value: string }) => <output data-readout="value">{`value: "${value}"`}</output>;

const renderFrame = (flags: InteractionFlags<TextFieldFlags>) => <Frame flags={flags} />;

export const Default = ({ initial = "" }: { initial?: string }) => {
    const valueState = useState(initial);

    return (
        <>
            <TextField
                id="field"
                element="input"
                ariaLabel="Name"
                padding={FIELD_PADDING}
                valueState={valueState}
                renderContent={renderFrame}
                renderPlaceholder={(flags) => (flags.isEmpty ? <span data-testid="placeholder">Your name</span> : null)}
            />
            <Readout value={valueState[0]} />
        </>
    );
};

export const TransformingSetter = () => {
    const [value, setValue] = useState("");

    return (
        <>
            <TextField
                id="field"
                element="input"
                ariaLabel="Coupon code"
                padding={FIELD_PADDING}
                valueState={[value, (next) => setValue(next.toLocaleUpperCase())]}
                renderContent={renderFrame}
            />
            <Readout value={value} />
        </>
    );
};

export const RefusingSetter = () => {
    const [value, setValue] = useState("");

    return (
        <>
            <TextField
                id="field"
                element="input"
                ariaLabel="PIN"
                inputMode="numeric"
                padding={FIELD_PADDING}
                valueState={[value, setValue]}
                hasError={value.length > 0 && value.length < PIN_LENGTH}
                renderContent={renderFrame}
                onInput={(next) => setValue(next.replace(/\D/g, "").slice(0, PIN_LENGTH))}
            />
            <Readout value={value} />
        </>
    );
};

export const NumberField = ({ isSpinButton = false }: { isSpinButton?: boolean }) => {
    const valueState = useState("10");

    return (
        <>
            <TextField
                id="field"
                element="input"
                type="number"
                ariaLabel="Quantity"
                min={0}
                max={100}
                step={5}
                isSpinButton={isSpinButton}
                padding={FIELD_PADDING}
                valueState={valueState}
                renderContent={renderFrame}
            />
            <Readout value={valueState[0]} />
        </>
    );
};

export const ReadOnly = () => {
    const valueState = useState("Can be read, not changed");

    return (
        <TextField
            id="field"
            element="input"
            ariaLabel="Reference"
            isReadOnly={true}
            padding={FIELD_PADDING}
            valueState={valueState}
            renderContent={renderFrame}
        />
    );
};

export const Disabled = () => {
    const valueState = useState("Nothing gets in");

    return (
        <TextField
            id="field"
            element="input"
            ariaLabel="Locked"
            isDisabled={true}
            padding={FIELD_PADDING}
            valueState={valueState}
            renderContent={renderFrame}
        />
    );
};

export const Errored = () => {
    const valueState = useState("not-an-email");

    return (
        <TextField
            id="field"
            element="input"
            type="email"
            ariaLabel="Email"
            isRequired={true}
            hasError={true}
            padding={FIELD_PADDING}
            valueState={valueState}
            renderContent={renderFrame}
        />
    );
};

export const Adorned = ({ hasLeading = true }: { hasLeading?: boolean }) => {
    const valueState = useState("");

    return (
        <TextField
            id="field"
            element="input"
            ariaLabel="Amount"
            padding={FIELD_PADDING}
            gap={4}
            valueState={valueState}
            renderContent={renderFrame}
            renderLeading={
                hasLeading
                    ? () => <span data-testid="leading" style={{ display: "block", width: ADORNMENT_WIDTH }} />
                    : undefined
            }
            renderTrailing={() => <span data-testid="trailing" style={{ display: "block", width: ADORNMENT_WIDTH }} />}
        />
    );
};

export const Labeled = () => {
    const valueState = useState("");

    return (
        <Label>
            <span>Nickname</span>
            <TextField
                id="field"
                element="input"
                ariaLabel="Ignored"
                padding={FIELD_PADDING}
                valueState={valueState}
                renderContent={renderFrame}
            />
        </Label>
    );
};

export const InField = () => {
    const valueState = useState("");

    return (
        <FormField
            message="Shown on your profile."
            renderControl={() => (
                <TextField
                    id="field"
                    element="input"
                    ariaLabel="Handle"
                    padding={FIELD_PADDING}
                    valueState={valueState}
                    renderContent={renderFrame}
                />
            )}
        />
    );
};
