import { useState } from "react";

import type { InteractionFlags } from "@thewaver/ss-components";

import { Checkbox, Label } from "../../src";

const BOX_SIZE = 20;

const Box = ({ flags }: { flags: InteractionFlags }) => (
    <span
        style={{
            display: "block",
            width: BOX_SIZE,
            height: BOX_SIZE,
            border: "1px solid black",
            opacity: flags.isDisabled ? 0.5 : 1,
        }}
    />
);

const TOOLTIP_DEFS = {
    placement: { x: "center", y: "top-out" },
    hoverShowDelayMs: 0,
    renderContent: () => <span>Kept reachable so this can be read</span>,
} as const;

export const Default = () => {
    const checkedState = useState(false);

    return (
        <>
            <Checkbox
                id="checkbox"
                ariaLabel="Plain"
                checkedState={checkedState}
                renderContent={(flags) => <Box flags={flags} />}
            />
            <output data-readout="checked">{String(checkedState[0])}</output>
        </>
    );
};

export const Uncontrolled = () => {
    const [changes, setChanges] = useState<boolean[]>([]);

    return (
        <>
            <Checkbox
                id="checkbox"
                ariaLabel="Own state"
                renderContent={(flags) => <Box flags={flags} />}
                onChange={(isChecked) => setChanges((prev) => [...prev, isChecked])}
            />
            <output data-readout="changes">{changes.join(", ")}</output>
        </>
    );
};

export const Mixed = () => {
    const [first, setFirst] = useState(true);
    const [second, setSecond] = useState(false);

    const isMixed = first !== second;
    const isAll = first && second;

    return (
        <>
            <Checkbox
                id="selectAll"
                ariaLabel="Select all"
                checkedState={[isAll, () => undefined]}
                isMixed={isMixed}
                renderContent={(flags) => <Box flags={flags} />}
                onChange={(isChecked) => {
                    setFirst(isChecked);
                    setSecond(isChecked);
                }}
            />
            <Checkbox
                id="firstChild"
                ariaLabel="First child"
                checkedState={[first, setFirst]}
                renderContent={(flags) => <Box flags={flags} />}
            />
            <Checkbox
                id="secondChild"
                ariaLabel="Second child"
                checkedState={[second, setSecond]}
                renderContent={(flags) => <Box flags={flags} />}
            />
            <output data-readout="mixed">{`mixed: ${isMixed} | all: ${isAll} | children: ${first}, ${second}`}</output>
        </>
    );
};

export const RefusedWrite = () => {
    const [isEmail, setIsEmail] = useState(true);
    const [isSms, setIsSms] = useState(false);

    return (
        <>
            <Checkbox
                id="email"
                ariaLabel="Email"
                checkedState={[isEmail, setIsEmail]}
                renderContent={(flags) => <Box flags={flags} />}
                onChange={(isChecked) => {
                    if (isChecked || isSms) return;

                    setIsEmail(true);
                }}
            />
            <Checkbox
                id="sms"
                ariaLabel="SMS"
                checkedState={[isSms, setIsSms]}
                renderContent={(flags) => <Box flags={flags} />}
                onChange={(isChecked) => {
                    if (isChecked || isEmail) return;

                    setIsSms(true);
                }}
            />
            <output data-readout="refused">{`email: ${isEmail} | sms: ${isSms}`}</output>
        </>
    );
};

export const Disabled = ({
    isDisabled = true,
    isReachable = false,
}: {
    isDisabled?: boolean;
    isReachable?: boolean;
}) => {
    const checkedState = useState(true);

    return (
        <>
            <Checkbox
                id="checkbox"
                ariaLabel="Disabled"
                checkedState={checkedState}
                isDisabled={isDisabled}
                isReachableWhenDisabled={isReachable}
                tooltipDefs={isReachable ? TOOLTIP_DEFS : undefined}
                renderContent={(flags) => <Box flags={flags} />}
            />
            <output data-readout="checked">{String(checkedState[0])}</output>
        </>
    );
};

export const Errored = () => (
    <Checkbox
        id="checkbox"
        ariaLabel="Errored"
        isRequired={true}
        hasError={true}
        renderContent={(flags) => <Box flags={flags} />}
    />
);

export const Labeled = ({ isDisabled = false, ariaLabel }: { isDisabled?: boolean; ariaLabel?: string }) => {
    const checkedState = useState(isDisabled);

    return (
        <>
            <Label>
                <Checkbox
                    id="checkbox"
                    ariaLabel={ariaLabel}
                    checkedState={checkedState}
                    isDisabled={isDisabled}
                    renderContent={(flags) => <Box flags={flags} />}
                />
                <span id="caption">Remember me</span>
            </Label>
            <output data-readout="checked">{String(checkedState[0])}</output>
        </>
    );
};
